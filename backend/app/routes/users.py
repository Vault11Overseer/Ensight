# backend/app/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from app.database.db import get_db
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

# =========================
# Pydantic Schemas
# =========================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    role: str = "user"  # 'user' or 'admin'

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: str
    updated_at: str | None

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    role: str | None = None  # Admin only

# =========================
# LIST USERS (admin only)
# =========================
@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), current_user=Depends()):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(User).all()
    return users

# =========================
# CREATE USER (admin only)
# =========================
@router.post("/", response_model=UserRead)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user=Depends()):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    user = User(username=data.username, email=data.email, role=data.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# =========================
# READ USER
# =========================
@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db), current_user=Depends()):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Only admin or the user themselves can view
    if not current_user.is_admin and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

# =========================
# UPDATE USER
# =========================
@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user=Depends()):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Only admin or the user themselves can update
    if not current_user.is_admin and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if data.username is not None:
        user.username = data.username
    if data.email is not None:
        user.email = data.email
    if data.role is not None:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Not authorized to change role")
        user.role = data.role
    db.commit()
    db.refresh(user)
    return user

# =========================
# DELETE USER
# =========================
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user=Depends()):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admin can delete users")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}
