"""
Carga el schema de la base de datos SIGPe (../database/db_schema.sql) en el
servidor MySQL indicado por las variables de entorno MYSQL_SERVER, MYSQL_PORT,
MYSQL_USERNAME, MYSQL_PASSWORD y MYSQL_DATABASE.

Pensado para ejecutarse como preDeployCommand en Railway (cwd = backend/),
pero también funciona corriéndolo manualmente desde backend/:

    python scripts/load_schema.py

Es idempotente: si la base de datos objetivo ya tiene la tabla `users`,
no vuelve a ejecutar el dump completo (evita romper triggers/datos en cada
nuevo deploy).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pymysql

# backend/scripts/load_schema.py -> backend/database/db_schema.sql
#
# NOTA: Railway construye el servicio con rootDirectory=backend, por lo que
# sólo el contenido de backend/ llega al contenedor. database/db_schema.sql
# (en la raíz del repo) NO está disponible en runtime, así que se mantiene
# una copia en backend/database/db_schema.sql. Si el schema fuente
# (database/db_schema.sql, en la raíz del repo) cambia, hay que sincronizar
# también esta copia.
SCHEMA_FILE = Path(__file__).resolve().parent.parent / "database" / "db_schema.sql"

MARKER_TABLE = "users"


def _env(name: str, default: str | None = None) -> str:
    value = os.environ.get(name, default)
    if value is None:
        print(f"[load_schema] Falta la variable de entorno {name}", file=sys.stderr)
        sys.exit(1)
    return value


def get_connection(database: str | None = None) -> pymysql.connections.Connection:
    return pymysql.connect(
        host=_env("MYSQL_SERVER"),
        port=int(_env("MYSQL_PORT", "3306")),
        user=_env("MYSQL_USERNAME"),
        password=_env("MYSQL_PASSWORD"),
        database=database,
        autocommit=False,
        charset="utf8mb4",
        connect_timeout=15,
    )


def already_loaded(database: str) -> bool:
    """True si `database` existe y ya tiene la tabla marcadora `users`."""
    try:
        conn = get_connection(database=database)
    except pymysql.err.OperationalError as exc:
        # 1049 = Unknown database
        if exc.args and exc.args[0] == 1049:
            return False
        raise
    try:
        with conn.cursor() as cur:
            cur.execute("SHOW TABLES LIKE %s", (MARKER_TABLE,))
            return cur.fetchone() is not None
    finally:
        conn.close()


def iter_statements(sql_text: str):
    """Separa un dump de mysqldump en sentencias individuales, respetando
    los cambios de DELIMITER (usados por triggers/stored procedures) y los
    literales de texto/identificadores entre comillas."""
    delimiter = ";"
    segment_lines: list[str] = []

    def flush(segment: str, delim: str):
        yield from _split_segment(segment, delim)

    for line in sql_text.splitlines():
        stripped = line.strip()
        if stripped.upper().startswith("DELIMITER "):
            yield from flush("\n".join(segment_lines), delimiter)
            segment_lines = []
            delimiter = stripped.split(None, 1)[1].strip()
            continue
        segment_lines.append(line)

    yield from flush("\n".join(segment_lines), delimiter)


def _split_segment(text: str, delimiter: str):
    buf: list[str] = []
    in_quote: str | None = None
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if in_quote:
            buf.append(ch)
            if ch == "\\" and i + 1 < n:
                buf.append(text[i + 1])
                i += 2
                continue
            if ch == in_quote:
                in_quote = None
            i += 1
            continue
        if ch in ("'", '"', "`"):
            in_quote = ch
            buf.append(ch)
            i += 1
            continue
        if text.startswith(delimiter, i):
            stmt = "".join(buf).strip()
            if stmt:
                yield stmt
            buf = []
            i += len(delimiter)
            continue
        buf.append(ch)
        i += 1
    tail = "".join(buf).strip()
    if tail:
        yield tail


def _has_sql_content(statement: str) -> bool:
    """False if `statement` is only made of `--` line comments / whitespace
    once versioned comments (/*! ... */) are taken into account."""
    without_line_comments = "\n".join(
        line for line in statement.splitlines() if not line.strip().startswith("--")
    )
    return without_line_comments.strip() != ""


def main() -> None:
    target_db = os.environ.get("MYSQL_DATABASE", "sigpe_test")

    if already_loaded(target_db):
        print(f"[load_schema] '{target_db}' ya tiene datos (tabla '{MARKER_TABLE}' existe). Se omite la carga.")
        return

    if not SCHEMA_FILE.exists():
        print(f"[load_schema] No se encontró {SCHEMA_FILE}; se omite la carga de schema.")
        return

    sql_text = SCHEMA_FILE.read_text(encoding="utf-8")
    statements = [s for s in iter_statements(sql_text) if _has_sql_content(s)]
    print(f"[load_schema] Ejecutando {len(statements)} sentencias sobre el servidor MySQL...")

    conn = get_connection(database=None)
    try:
        with conn.cursor() as cur:
            for idx, stmt in enumerate(statements, start=1):
                try:
                    cur.execute(stmt)
                except pymysql.MySQLError as exc:
                    print(f"[load_schema] Error en sentencia #{idx}: {exc}", file=sys.stderr)
                    print(f"--- SQL ---\n{stmt[:500]}", file=sys.stderr)
                    raise
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    print(f"[load_schema] Schema cargado correctamente en '{target_db}'.")


if __name__ == "__main__":
    main()
