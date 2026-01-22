# backend/app/routes/users.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.utils.auth import hash_password, verify_password
from app.auth.dev_auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


# =========================
# LIST USERS (Admin only - full CRUD access to all users)
# =========================
@router.get("/", response_model=List[UserRead])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin only: List all users in the system.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(User).all()


# =========================
# CREATE USER (Admin only - full CRUD access to all users)
# =========================
@router.post("/", response_model=UserRead)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin only: Create new users.
    Validates role is either 'admin' or 'user'.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Validate role
    if data.role not in ["admin", "user"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be either 'admin' or 'user'"
        )

    hashed_pw = hash_password(data.password)

    user = User(
        username=data.username,
        email=data.email,
        first_name=data.first_name,
        last_name=data.last_name,
        role=data.role,
        avatar=data.avatar,
        cognito_sub=data.cognito_sub,
        password_hash=hashed_pw,
        profile_metadata=data.profile_metadata,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# =========================
# READ USER (Users can view their own, admins can view any)
# =========================
@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can view their own profile.
    Admins can view any user's profile.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != "admin" and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return user


# =========================
# UPDATE USER (Users can update their own, admins can update any)
# =========================
@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can update their own profile (except role).
    Admins can update any user's profile including role.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != "admin" and current_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if data.username is not None:
        user.username = data.username

    if data.email is not None:
        user.email = data.email

    if data.avatar is not None:
        user.avatar = data.avatar

    if data.cognito_sub is not None:
        # Only allow updating cognito_sub if it's not already set, or if admin
        if current_user.role == "admin" or user.cognito_sub is None:
            user.cognito_sub = data.cognito_sub

    if data.first_name is not None:
        user.first_name = data.first_name

    if data.last_name is not None:
        user.last_name = data.last_name

    if data.role is not None:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Not authorized to change role"
            )
        # Validate role
        if data.role not in ["admin", "user"]:
            raise HTTPException(
                status_code=400,
                detail="Role must be either 'admin' or 'user'"
            )
        user.role = data.role

    if data.password is not None:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user


# =========================
# DELETE USER (Admin only - full CRUD access to all users)
# =========================
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin only: Delete any user from the system.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete users")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}


# =========================
# DEV LOGIN (TEMPORARY)
# =========================
@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role,
    }
