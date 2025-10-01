# from fastapi import Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select
# from pydantic import BaseModel, EmailStr

# from app.db.session import get_db
# from app.models.user import User
# from app.core.security import hash_password
# from passlib.context import CryptContext  

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class RegisterIn:
#     name: str
#     email: str
#     password: str

# async def register_user(user: RegisterIn, db: AsyncSession):
#     # 1. Check if user with email already exists
#     result = await db.execute(select(User).where(User.email == user.email))
#     existing_user = result.scalar_one_or_none()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     # 2. Hash the password
#     hashed_password = pwd_context.hash(user.password)

#     # 3. Create the new user
#     new_user = User(
#         name=user.name,
#         email=user.email,
#         hashed_password=hashed_password
#     )

#     # 4. Add and commit
#     db.add(new_user)
#     await db.commit()
#     await db.refresh(new_user)

#     # 5. Return minimal info
#     return {
#         "id": new_user.id,
#         "name": new_user.name,
#         "email": new_user.email
#     }


# app/auth/register.py
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr

from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password
from passlib.context import CryptContext  

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Make this a proper Pydantic model so FastAPI can parse it
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str

async def register_user(user: RegisterIn, db: AsyncSession):
    # 1. Check if user with email already exists
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    hashed_password = pwd_context.hash(user.password)

    # 3. Create the new user
    new_user = User(
        name=user.name,
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
        "name": new_user.name,
        "email": new_user.email
    }
