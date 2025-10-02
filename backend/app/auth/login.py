from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.login import LoginIn, TokenOut


class LoginIn(BaseModel):
    email: EmailStr
    password: str


async def login_user(user: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalar_one_or_none()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}
