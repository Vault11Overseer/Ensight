import asyncio
from app.db.database import async_engine, init_db
from app.models import Base, User

async def reset_users():
    # Make sure all tables exist first
    await init_db()

    async with async_engine.begin() as conn:
        # Drop the users table if it exists
        await conn.run_sync(User.__table__.drop, checkfirst=True)
        # Recreate the users table
        await conn.run_sync(User.__table__.create)

    print("Users table reset complete!")

if __name__ == "__main__":
    asyncio.run(reset_users())
