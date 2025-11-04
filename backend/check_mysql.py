import sys
from dotenv import load_dotenv
import os
import mysql.connector
import traceback

# permitir pasar la password como primer argumento opcional
if len(sys.argv) > 1:
    PASSWORD = sys.argv[1]
else:
    load_dotenv(".env")
    PASSWORD = os.getenv("MYSQL_PASSWORD", "root")

HOST = os.getenv("MYSQL_HOST", "127.0.0.1")
USER = os.getenv("MYSQL_USER", "root")
DB = os.getenv("MYSQL_DATABASE", "sigpe_test")
PORT = int(os.getenv("MYSQL_PORT", 3306))

print("Conectando a:", HOST, "usuario:", USER, "db:", DB)

try:
    conn = mysql.connector.connect(host=HOST, user=USER, password=PASSWORD, database=DB, port=PORT)
    cur = conn.cursor()
    cur.execute("SELECT id,titulo,archivo_nombre,created_at FROM pedidos_impresion ORDER BY id DESC LIMIT 5;")
    for row in cur.fetchall():
        print(row)
    conn.close()
except Exception as e:
    print("ERROR:", e)
    print(traceback.format_exc())