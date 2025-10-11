import asyncio
import os
from backend.db.database import async_engine, Base
from app.models.user import User  # required so SQLAlchemy sees User
from app.models.image import Image  # required so SQLAlchemy sees Image

DB_FILE = "./app/db/database.db"

async def reset_db():
    # Delete old DB file to avoid leftover indexes/tables
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        print(f"Deleted old database: {DB_FILE}")

    # Recreate tables
    async with async_engine.begin() as conn:
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("All tables created successfully!")

    print("✅ Database reset complete!")

if __name__ == "__main__":
    asyncio.run(reset_db())
