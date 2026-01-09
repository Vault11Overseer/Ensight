# app/db/session.py

# ======================================
# DATABASE SESSION
# ======================================

# ======================================
# IMPORTS
# ======================================
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# ======================================
# CREATING DATABASE ENGINE
# ======================================
engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG, future=True)

# ======================================
# SESSION LOCAL - SESSION MAKER
# ======================================
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# ======================================
# DEPENDENCY FOR FASTAPI
# ======================================
async def get_db():
    async with SessionLocal() as session:
        yield session
