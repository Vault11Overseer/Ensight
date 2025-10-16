# backend/app/scripts/reset_users_table.py

# ======================================
# RESET USERS TABLE
# ======================================

# ======================================
# IMPORTS
# ======================================

import asyncio
import os
from backend.db.database import async_engine, Base
import app.models.user  # <-- import all models so metadata sees them

DB_FILE = "./app/db/database.db"

# ======================================
# RESET USERS TABLE IN THE DATABASE
# ======================================
async def reset_db():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        print(f"Deleted old database: {DB_FILE}")

    async with async_engine.begin() as conn:
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("All tables created successfully!")

if __name__ == "__main__":
    asyncio.run(reset_db())
