# backend/app/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.utils.auth import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["Users"])

# =========================
# LIST USERS (admin only)
# =========================
@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), current_user=Depends()):
    if not current_user.role == "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(User).all()
    return users

# =========================
# CREATE USER (admin only)
# =========================
@router.post("/", response_model=UserRead)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user=Depends()):
    if not current_user.role == "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Hash the password before storing
    hashed_pw = hash_password(data.password)

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hashed_pw,
        role=data.role,
    )
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
    if not current_user.role == "admin" and current_user.id != user.id:
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
    if not current_user.role == "admin" and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if data.username is not None:
        user.username = data.username
    if data.email is not None:
        user.email = data.email
    if data.role is not None:
        if not current_user.role == "admin":
            raise HTTPException(status_code=403, detail="Not authorized to change role")
        user.role = data.role
    if data.password is not None:
        # Hash the new password if updating
        user.password_hash = hash_password(data.password)

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

    if not current_user.role == "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete users")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}

# =========================
# LOGIN ENDPOINT
# =========================
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # For dev purposes, just return user info (later Cognito/JWT goes here)
    return {"user_id": user.id, "username": user.username, "role": user.role}
