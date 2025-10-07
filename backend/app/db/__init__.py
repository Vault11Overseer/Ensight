# backend/app/db/__init__.py

# Expose SessionLocal and get_db globally for cleaner imports
from .session import SessionLocal, get_db
