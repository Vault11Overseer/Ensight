# backend/app/auth/dev_auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Dev Auth"])


# =========================
# DEV AUTH DEPENDENCY
# =========================
def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    DEV ONLY.
    Returns the first user in the DB.
    Replaced later by Cognito/JWT auth.
    """
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# =========================
# DEV LOGIN ENDPOINT
# =========================
@router.get("/login")
def dev_login(db: Session = Depends(get_db)):
    """
    Temporary developer login.
    Frontend calls this once and stores the user object.
    """
    user = db.query(User).filter(User.username == "bciadmin").first()

    if not user:
        raise HTTPException(
            status_code=500,
            detail="Dev user missing. Run init_db.py first."
        )

    return JSONResponse({
        "status": "dev user ready",
        "user": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
        }
    })
