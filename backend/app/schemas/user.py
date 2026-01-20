from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import datetime

# =========================
# CREATE USER (for signup/admin creation)
# =========================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str                  # <-- plain password input, will be hashed
    role: str = "user"             # 'user' or 'admin'
    first_name: str                # NEW
    last_name: str                 # NEW
    profile_metadata: Optional[Dict] = {}  # JSON info for avatar, preferences, etc.

# =========================
# READ USER (for responses)
# =========================
class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    first_name: str
    last_name: str
    profile_metadata: Optional[Dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        # orm_mode = True
        from_attributes = True

# =========================
# UPDATE USER
# =========================
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_metadata: Optional[Dict] = None

