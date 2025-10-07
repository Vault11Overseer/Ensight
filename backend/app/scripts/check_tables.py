from app.db.session import async_session
from app.models.user import User
from app.models.library import Library
import asyncio

async def check_tables():
    async with async_session() as session:
        users = await session.execute("SELECT * FROM users")
        print("Users:", users.fetchall())
        libraries = await session.execute("SELECT * FROM libraries")
        print("Libraries:", libraries.fetchall())

asyncio.run(check_tables())
