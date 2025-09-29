from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from .database import get_db
from .models import User
from .security import hash_password, verify_password, create_access_token, decode_access_token

# Input schemas
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

router = APIRouter()

# OAuth2 scheme (matches login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# -----------------------------
# Register Endpoint
# -----------------------------
@router.post("/register")
async def register(user: RegisterIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email}

# -----------------------------
# Login Endpoint
# -----------------------------
@router.post("/login", response_model=TokenOut)
async def login(user: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# -----------------------------
# Dependency to get current user from token
# -----------------------------
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_access_token(token)
    user_id = int(payload.get("sub"))
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return db_user


# -----------------------------
# Current user endpoint
# -----------------------------
@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": getattr(current_user, "name", None),  # if you have a name field
        # add other fields you want to expose
    }
