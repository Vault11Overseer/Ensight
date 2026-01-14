# backend/app/database/db.py

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load .env file (local dev only)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in .env")

# SQLALCHEMY ENGINE
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # prevents dropped Render connections
    connect_args={"sslmode": "require"},
    echo=True,           # logs SQL for debugging
)

# SESSION FACTORY
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# BASE CLASS FOR ORM MODELS
Base = declarative_base()

# PRINT CALL
print("✅ DATABASE_URL loaded")
