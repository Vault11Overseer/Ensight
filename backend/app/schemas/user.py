from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

# =========================
# CREATE USER (for signup/admin creation)
# =========================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str                  # <-- plain password input, will be hashed
    role: str = "user"             # 'user' or 'admin'
    profile_metadata: Optional[Dict] = {}  # JSON info for avatar, preferences, etc.

# =========================
# READ USER (for responses)
# =========================
class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    profile_metadata: Optional[Dict] = None
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True  # allows reading from SQLAlchemy models

# =========================
# UPDATE USER
# =========================
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None          # for password change
    role: Optional[str] = None              # admin-only
    profile_metadata: Optional[Dict] = None
