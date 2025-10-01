# app/services/migrate_users_table.py
import asyncio
from sqlalchemy import text
from app.db.database import async_engine, init_db
from app.models.user import User

async def migrate_users():
    # Ensure other tables exist
    await init_db()

    async with async_engine.begin() as conn:
        # Check if 'name' column exists
        result = await conn.execute(
            text("PRAGMA table_info(users);")
        )
        columns = [row[1] for row in result.fetchall()]  # row[1] is the column name

        if "name" not in columns:
            print("Adding 'name' column to users table...")
            await conn.execute(text("ALTER TABLE users ADD COLUMN name TEXT DEFAULT ''"))
        else:
            print("'name' column already exists.")

    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate_users())
