import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

print("DATABASE_URL =", os.getenv("DATABASE_URL"))

try:
    conn = psycopg2.connect(
        os.getenv("DATABASE_URL"),
        sslmode="require"
    )
    print("✅ Connected to database")

    cur = conn.cursor()
    cur.execute("SELECT 1;")
    print("Query result:", cur.fetchone())

    cur.close()
    conn.close()
    print("✅ Connection closed cleanly")

except Exception as e:
    print("❌ Connection failed:")
    print(type(e), e)
