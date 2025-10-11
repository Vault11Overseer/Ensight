import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.config import settings

# -------------------------
# DATABASE PATH
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
DB_FOLDER = BASE_DIR / "db"
DB_PATH = DB_FOLDER / "database.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{DB_PATH}")

print("Using DATABASE_URL:", DATABASE_URL)

# -------------------------
# ASYNC ENGINE & SESSION
# -------------------------
async_engine = create_async_engine(DATABASE_URL, echo=True)
engine = async_engine

async_session = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
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
    """Create all tables if they don't exist"""
    from app.models.user import User  # import all models here
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database initialized!")
    
# Optional CLI run
if __name__ == "__main__":
    asyncio.run(init_db())
