# app/scripts/check_user.py
import asyncio
from app.db import SessionLocal
from app.models.user import User

async def main():
    async with SessionLocal() as session:
        result = await session.execute("SELECT * FROM user")  # or ORM query
        users = result.fetchall()
        print(users)

if __name__ == "__main__":
    asyncio.run(main())
