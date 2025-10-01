

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth.register import register_user, RegisterIn
from app.auth.login import login_user, LoginIn
from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_access_token


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# -------------------------
# REGISTER ENDPOINT
# -------------------------
@router.post("/register")
async def register(user: RegisterIn, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    Expects RegisterIn schema with name, email, and password.
    """
    return await register_user(user, db)
    print(user)


# -------------------------
# LOGIN ENDPOINT
# -------------------------
@router.post("/login")
async def login(user: LoginIn, db: AsyncSession = Depends(get_db)):
    """
    Login a user.
    Expects LoginIn schema with email and password.
    """
    return await login_user(user, db)


# -------------------------
# CURRENT USER DEPENDENCY
# -------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Extracts user from JWT token.
    Raises 401 if invalid.
    """
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    return db_user


# -------------------------
# CURRENT USER ENDPOINT
# -------------------------
@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged-in user.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": getattr(current_user, "name", None),
    }
