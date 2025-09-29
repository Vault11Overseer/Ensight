# backend/app/db/session.py

from app.db.database import async_session
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db() -> AsyncSession:
    """Async context manager to provide a database session for FastAPI dependencies."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
