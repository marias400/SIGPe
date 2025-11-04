from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
from core.config_loader import settings
from typing import Optional
import logging
import sqlite3
from urllib.parse import urlparse, unquote
import uuid

router = APIRouter(prefix="/api/orders", tags=["orders"])

# prefer MySQL if configured, otherwise sqlite local file for dev
def get_db_conn():
    # 1) If DATABASE_URL provided, attempt to parse and connect using mysql.connector
    db_url = "mysql+mysqlconnector://root:root@127.0.0.1:3306/sigpe_test"
    if db_url:
        parsed = urlparse(db_url)
        scheme = parsed.scheme  # e.g. mysql+mysqlconnector or mysql+pymysql
        if scheme.startswith("mysql"):
            try:
                # extract credentials and host/port/db
                user = unquote(parsed.username or "")
                password = unquote(parsed.password or "")
                host = parsed.hostname or "localhost"
                port = parsed.port or 3306
                dbname = parsed.path.lstrip("/") or ""
                import mysql.connector
                conn = mysql.connector.connect(
                    host=host,
                    user=user,
                    password=password,
                    database=dbname,
                    port=port,
                )
                return ("mysql", conn)
            except Exception:
                logging.exception("Failed to connect using DATABASE_URL, will fallback")
                # fallthrough to other methods/fallback
    # 2) If explicit MYSQL_* settings exist, try them
    MYSQL_HOST = getattr(settings, "MYSQL_HOST", None)
    MYSQL_USER = getattr(settings, "MYSQL_USER", None)
    if MYSQL_HOST and MYSQL_USER:
        try:
            import mysql.connector
            conn = mysql.connector.connect(
                host=MYSQL_HOST,
                user=getattr(settings, "MYSQL_USER", "root"),
                password=getattr(settings, "MYSQL_PASSWORD", "root"),
                database=getattr(settings, "MYSQL_DATABASE", "sigpe_test"),
                port=int(getattr(settings, "MYSQL_PORT", 3306)),
            )
            return ("mysql", conn)
        except Exception:
            logging.exception("MySQL connect failed using MYSQL_* settings, falling back to sqlite")
    # 3) sqlite fallback for local dev
    db_path = Path(__file__).resolve().parent / "dev_orders.db"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    # ensure table exists
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS pedidos_impresion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        email_contacto TEXT,
        cliente_nombre TEXT,
        archivo_nombre TEXT,
        archivo_path TEXT,
        cantidad INTEGER DEFAULT 1,
        material TEXT,
        color TEXT,
        altura_capa TEXT,
        relleno_pct INTEGER,
        estado TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
    );
    """
    conn.execute(create_table_sql)
    conn.commit()
    return ("sqlite", conn)

class OrderUpdate(BaseModel):
    titulo: Optional[str] = None
    estado: Optional[str] = None
    material: Optional[str] = None
    cantidad: Optional[int] = None
    color: Optional[str] = None

logger = logging.getLogger(__name__)

@router.post("/")
async def create_order(
    titulo: str = Form(...),
    email_contacto: Optional[str] = Form(None),
    cliente_nombre: Optional[str] = Form(None),
    cantidad: int = Form(1),
    material: str = Form("PLA"),
    color: Optional[str] = Form(None),
    altura_capa: Optional[str] = Form(None),
    relleno_pct: Optional[int] = Form(None),
    estado: Optional[str] = Form(None),
    archivo: Optional[UploadFile] = File(None),
):
    # validate
    if not titulo:
        raise HTTPException(status_code=400, detail="titulo es requerido")
    if not archivo:
        raise HTTPException(status_code=400, detail="archivo es requerido")

    # save file under uploads/<random>_<filename>
    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}_{Path(archivo.filename).name}"
    file_path = upload_dir / safe_name

    try:
        content = await archivo.read()
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception:
        logging.exception("Error saving uploaded file")
        raise HTTPException(status_code=500, detail="Error al guardar el archivo")
    finally:
        try:
            await archivo.close()
        except Exception:
            pass

    db_type, conn = get_db_conn()
    logger.info("create_order using DB type: %s", db_type)
    try:
        if db_type == "mysql":
            cursor = conn.cursor()
            sql = """
            INSERT INTO pedidos_impresion
                (titulo, email_contacto, cliente_nombre, archivo_nombre, archivo_path, cantidad, material, color, altura_capa, relleno_pct, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            params = (titulo, email_contacto, cliente_nombre, archivo.filename, str(file_path), cantidad, material, color, altura_capa, relleno_pct, estado)
            cursor.execute(sql, params)
            conn.commit()
            order_id = cursor.lastrowid
            cursor.close()
        else:
            cursor = conn.cursor()
            sql = """
            INSERT INTO pedidos_impresion
                (titulo, email_contacto, cliente_nombre, archivo_nombre, archivo_path, cantidad, material, color, altura_capa, relleno_pct, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = (titulo, email_contacto, cliente_nombre, archivo.filename, str(file_path), cantidad, material, color, altura_capa, relleno_pct, estado)
            cursor.execute(sql, params)
            conn.commit()
            order_id = cursor.lastrowid
            cursor.close()
    except Exception:
        logging.exception("DB insert failed")
        raise HTTPException(status_code=500, detail="Error al crear el pedido")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    # TEMP: include db_type in response for debugging (remove later)
    return JSONResponse({"id": order_id, "message": "Pedido creado correctamente", "db": db_type})

# 🔹 READ ALL (GET)
@router.get("/")
def get_orders():
    db_type, conn = get_db_conn()
    try:
        sql = "SELECT * FROM pedidos_impresion WHERE is_deleted = 0 ORDER BY id DESC"
        if db_type == "mysql":
            cursor = conn.cursor(dictionary=True)
            cursor.execute(sql)
            rows = cursor.fetchall()
            cursor.close()
        else:
            cur = conn.cursor()
            cur.execute(sql)
            rows = [dict(row) for row in cur.fetchall()]
        return rows
    finally:
        try:
            conn.close()
        except Exception:
            pass
 
# 🔹 READ ONE (GET /:id)
@router.get("/{order_id}")
def get_order(order_id: int):
    db_type, conn = get_db_conn()
    try:
        if db_type == "mysql":
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM pedidos_impresion WHERE id = %s", (order_id,))
            row = cursor.fetchone()
            cursor.close()
        else:
            cur = conn.cursor()
            cur.execute("SELECT * FROM pedidos_impresion WHERE id = ?", (order_id,))
            r = cur.fetchone()
            row = dict(r) if r else None
        if not row:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return row
    finally:
        try:
            conn.close()
        except Exception:
            pass
 
# 🔹 UPDATE (PUT)
@router.put("/{order_id}")
def update_order(order_id: int, data: OrderUpdate):
    db_type, conn = get_db_conn()
    updates = []
    values = []
    for field, value in data.dict().items():
        if value is not None:
            updates.append(f"{field} = %s" if db_type == "mysql" else f"{field} = ?")
            values.append(value)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    try:
        if db_type == "mysql":
            sql = f"UPDATE pedidos_impresion SET {', '.join(updates)}, updated_at = NOW() WHERE id = %s"
            values.append(order_id)
            cursor = conn.cursor()
            cursor.execute(sql, tuple(values))
            conn.commit()
            cursor.close()
        else:
            sql = f"UPDATE pedidos_impresion SET {', '.join(updates)}, created_at = created_at WHERE id = ?"
            # sqlite: append id param
            values.append(order_id)
            cur = conn.cursor()
            cur.execute(sql, tuple(values))
            conn.commit()
            cur.close()
        return {"success": True}
    finally:
        try:
            conn.close()
        except Exception:
            pass
 
# 🔹 DELETE (soft delete)
@router.delete("/{order_id}")
def delete_order(order_id: int):
    db_type, conn = get_db_conn()
    try:
        if db_type == "mysql":
            cursor = conn.cursor()
            cursor.execute("UPDATE pedidos_impresion SET is_deleted = 1, updated_at = NOW() WHERE id = %s", (order_id,))
            conn.commit()
            cursor.close()
        else:
            cur = conn.cursor()
            cur.execute("UPDATE pedidos_impresion SET is_deleted = 1 WHERE id = ?", (order_id,))
            conn.commit()
            cur.close()
        return JSONResponse({"success": True})
    finally:
        try:
            conn.close()
        except Exception:
            pass
