# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from sqlalchemy.exc import OperationalError
# from sqlalchemy import text
# from app.database.db import SessionLocal

# router = APIRouter(prefix="/health", tags=["health"])

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.get("")
# def health_check(db: Session = Depends(get_db)):
#     try:
#         db.execute(text("SELECT 1"))
#         db_status = "connected"
#     except OperationalError:
#         db_status = "disconnected"

#     return {
#         "backend": "running",
#         "database": db_status
#     }



# backend/app/routes/health.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)

@router.get("/")
def health_check(db: Session = Depends(get_db)):
    """
    Basic health check endpoint.

    - Confirms FastAPI is running
    - Confirms database connection is alive
    """
    try:
        # Lightweight DB check (no data touched)
        db.execute("SELECT 1")
        db_status = "ok"
    except Exception:
        db_status = "error"

    return {
        "status": "ok",
        "api": "running",
        "database": db_status,
    }
