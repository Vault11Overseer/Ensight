# app/schemas/login.py

# ======================================
# LOGIN SCHEMA
# ======================================

# ======================================
# IMPORTS
# ======================================
from pydantic import BaseModel, EmailStr

# ======================================
# LOGIN IN - BASE MODEL
# ======================================
class LoginIn(BaseModel):
    email: EmailStr
    password: str

# ======================================
# TOKEN OUT - BASE MODEL
# ======================================
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
