# # app/auth/dev_auth.py

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database.db import get_db
# from app.models.user import User
# from app.schemas.user import UserRead

# router = APIRouter(prefix="/auth", tags=["Dev Auth"])

# @router.get("/login", response_model=UserRead)
# def dev_login(db: Session = Depends(get_db)):
#     """
#     Return dev user as JSON so frontend can display first_name.
#     """
#     user = db.query(User).filter(User.username == "bciadmin").first()
#     if not user:
#         raise HTTPException(
#             status_code=500,
#             detail="Dev user missing. Run init_db.py first."
#         )
#     return user


# app/auth/dev_auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Dev Auth"])


@router.get("/login")
def dev_login(db: Session = Depends(get_db)):
    """
    Temporary developer login.
    Returns minimal JSON for frontend SPA without schema validation errors.
    """
    user = db.query(User).filter(User.username == "bciadmin").first()

    if not user:
        raise HTTPException(
            status_code=500,
            detail="Dev user missing. Run app/scripts/init_db.py first."
        )

    # Return minimal user info to frontend
    return JSONResponse(
        {
            "status": "dev user ready",
            "user": {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": user.role,
            },
        }
    )
