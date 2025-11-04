from fastapi import APIRouter, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from pathlib import Path
import mysql.connector
from core.config_loader import settings
from mysql.connector import Error as MySQLError
import sqlite3

router = APIRouter(prefix="/api/orders", tags=["orders"])

# ⚙️ Conexión a MySQL
def get_db():
    # preferir credenciales desde settings/.env
    if getattr(settings, "MYSQL_HOST", None) and getattr(settings, "MYSQL_USER", None):
        try:
            return mysql.connector.connect(
                host=getattr(settings, "MYSQL_HOST", "localhost"),
                user=getattr(settings, "MYSQL_USER"),
                password=getattr(settings, "MYSQL_PASSWORD", ""),
                database=getattr(settings, "MYSQL_DATABASE", ""),
                port=int(getattr(settings, "MYSQL_PORT", 3306)),
            )
        except MySQLError:
            # no exponer detalles sensibles al cliente; registrar en logs y devolver HTTPException
            raise HTTPException(status_code=500, detail="Error de conexión a la base de datos MySQL")
    # fallback a sqlite para desarrollo local
    db_path = Path(__file__).resolve().parent / "dev_orders.db"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# 📦 Modelo para actualizar
class OrderUpdate(BaseModel):
    titulo: str | None = None
    estado: str | None = None
    material: str | None = None
    cantidad: int | None = None
    color: str | None = None

# 🔹 CREATE (POST)
@router.post("/")
async def create_order(
    titulo: str = Form(...),
    email_contacto: str | None = Form(None),
    cliente_nombre: str | None = Form(None),
    cantidad: int = Form(1),
    material: str = Form("PLA"),
    archivo: UploadFile | None = None
):
    # validar archivo
    if not archivo:
        raise HTTPException(status_code=400, detail="archivo es requerido")

    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / archivo.filename

    # leer y guardar el contenido del UploadFile
    try:
        content = await archivo.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    finally:
        await archivo.close()

    db = get_db()
    cursor = db.cursor()
    sql = """
    INSERT INTO pedidos_impresion (titulo, email_contacto, cliente_nombre, archivo_nombre, archivo_url, cantidad, material)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (titulo, email_contacto, cliente_nombre, archivo.filename, str(file_path), cantidad, material))
    db.commit()
    order_id = cursor.lastrowid
    cursor.close()
    db.close()
    return {"id": order_id, "message": "Pedido creado correctamente"}

# 🔹 READ ALL (GET)
@router.get("/")
def get_orders():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pedidos_impresion WHERE is_deleted = 0 ORDER BY id DESC")
    rows = cursor.fetchall()
    cursor.close()
    db.close()
    return rows

# 🔹 READ ONE (GET /:id)
@router.get("/{order_id}")
def get_order(order_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pedidos_impresion WHERE id = %s", (order_id,))
    row = cursor.fetchone()
    cursor.close()
    db.close()
    if not row:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return row

# 🔹 UPDATE (PUT)
@router.put("/{order_id}")
def update_order(order_id: int, data: OrderUpdate):
    db = get_db()
    cursor = db.cursor()

    updates = []
    values = []
    for field, value in data.dict().items():
        if value is not None:
            updates.append(f"{field} = %s")
            values.append(value)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    values.append(order_id)
    sql = f"UPDATE pedidos_impresion SET {', '.join(updates)}, updated_at = NOW() WHERE id = %s"
    cursor.execute(sql, tuple(values))
    db.commit()
    cursor.close()
    db.close()
    return {"success": True}

# 🔹 DELETE (soft delete)
@router.delete("/{order_id}")
def delete_order(order_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE pedidos_impresion SET is_deleted = 1, updated_at = NOW() WHERE id = %s", (order_id,))
    db.commit()
    cursor.close()
    db.close()
    return JSONResponse({"success": True})
