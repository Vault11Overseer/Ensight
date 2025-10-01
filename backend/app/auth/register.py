
# app/auth/register.py
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr

from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password
from passlib.context import CryptContext  
from app.schemas.user import UserCreate

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



async def register_user(user: UserCreate, db: AsyncSession):
    
    # 1. Check if user with email already exists
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    hashed_password = pwd_context.hash(user.password)

    # 3. Create the new user
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hashed_password
    )

    # 4. Add and commit
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # 5. Return minimal info
    return {
        "id": new_user.id,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "email": new_user.email
    }
