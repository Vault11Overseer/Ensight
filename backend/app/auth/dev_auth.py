# app/auth/dev_auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Dev Auth"])


@router.get("/login")
def dev_login(db: Session = Depends(get_db)):
    """
    Temporary developer login.

    Assumes a dev/admin user already exists in the database
    (created via app/scripts/init_db.py).

    This route does NOT create users or hash passwords.
    """
    user = db.query(User).filter(User.username == "bciadmin").first()

    if not user:
        raise HTTPException(
            status_code=500,
            detail="Dev user missing. Run app/scripts/init_db.py first."
        )

    # In real auth, you'd set a session or JWT here.
    # For dev, we simply redirect.
    return RedirectResponse(url="/dashboard", status_code=302)
