# backend/app/routers/auth_router.py

# ======================================
# AUTH ROUTER
# ======================================

# ======================================
# IMPORTS
# ======================================
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.auth.register import register_user, UserCreate
from app.auth.login import login_user, LoginIn
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate 
from app.core.security import decode_access_token, verify_password, create_access_token
from jose import JWTError, jwt
from app.core.config import JWT_SECRET_KEY, JWT_ALGORITHM

# ======================================
# ROUTER ENDPOINT
# ======================================
router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ======================================
# REGISTER ENDPOINT
# ======================================
@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    This version accepts form-data (like a normal HTML form).
    """
    return await register_user(user, db)

# ======================================
# LOGIN ENDPOINT
# ======================================
@router.post("/login")
async def login(user_data: LoginIn, db: AsyncSession = Depends(get_db)):
    """
    Login a user.
    Expects LoginIn schema with email and password.
    """
    # Query async instead of using db.query()
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    # If user not found or password doesn't match
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

# ======================================
# CURRENT USER DEPENDENCY
# ======================================
from uuid import UUID

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user_uuid = UUID(user_id)  # ✅ Convert string → UUID
    except ValueError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalars().first()

    if db_user is None:
        raise credentials_exception

    return db_user


# ======================================
# CURRENT USER ENDPOINT /ME
# ======================================
@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged-in user with their details.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": getattr(current_user, "first_name", None),
        "last_name": getattr(current_user, "last_name", None),
    }