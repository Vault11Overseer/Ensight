from pydantic import BaseModel, EmailStr, field_validator
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
    first_name: str
    last_name: str
    avatar: Optional[str] = None
    cognito_sub: Optional[str] = None
    profile_metadata: Optional[Dict] = {}  # JSON info for avatar, preferences, etc.

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ["admin", "user"]:
            raise ValueError("Role must be either 'admin' or 'user'")
        return v

# =========================
# READ USER (for responses)
# =========================
class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    cognito_sub: Optional[str] = None
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
    avatar: Optional[str] = None
    cognito_sub: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_metadata: Optional[Dict] = None

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v is not None and v not in ["admin", "user"]:
            raise ValueError("Role must be either 'admin' or 'user'")
        return v

