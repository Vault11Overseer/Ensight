# backend/app/schemas/user.py

# ======================================
# USER SCHEMA
# ======================================

# ======================================
# IMPORTS
# ======================================
from pydantic import BaseModel, EmailStr

# ======================================
# USER CREATE - BASE MODEL
# ======================================
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

# ======================================
# USER OUT - BASE MODEL
# ======================================
class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    class Config:
        from_attributes = True
