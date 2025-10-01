# app/db/database.py

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
# -------------------------
# DATABASE URL
# -------------------------
DATABASE_URL = "sqlite+aiosqlite:///./app/db/database.db"  # <- your db

# -------------------------
# ASYNC ENGINE
# -------------------------
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # logs SQL queries
)



# -------------------------
# ASYNC SESSION
# -------------------------
async_session = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# -------------------------
# BASE CLASS
# -------------------------
Base = declarative_base()

# -------------------------
# CONTEXT MANAGER FOR DB
# -------------------------
@asynccontextmanager
async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except:
            await session.rollback()
            raise

# -------------------------
# INITIALIZE DATABASE
# -------------------------
async def init_db():
    """
    Create all tables if they don't exist.
    Imports models here so Base.metadata knows about them.
    """
    # Import all models so SQLAlchemy knows their tables
    from app.models.user import User  # adjust if your User model is elsewhere
    # import app.models.user
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database initialized and all tables created!")

# Optional helper to run init_db from CLI
if __name__ == "__main__":
    asyncio.run(init_db())
