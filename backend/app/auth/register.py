# app/auth/register.py

# ======================================
# REGISTER ROUTER
# ======================================

# ======================================
# IMPORTS
# ======================================
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password
from passlib.context import CryptContext  
from app.schemas.user import UserCreate

# ======================================
# PASSWORD HASHING
# ======================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ======================================
# REGISTER USER METHOD
# ======================================
async def register_user(user: UserCreate, db: AsyncSession):
    
    # CHECK IF USER WITH EMAIL ALREADY EXSISTS
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # HASK THE PASSWORD
    hashed_password = pwd_context.hash(user.password)

    # CREATE THE NEW USER
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hashed_password
    )

    # ADD AND COMMIT
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # RETURN ONLY THE ESSENTIAL INFO
    return {
        "id": new_user.id,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "email": new_user.email
    }
