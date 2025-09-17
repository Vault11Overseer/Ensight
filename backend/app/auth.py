# backend/auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

# Create router
router = APIRouter()

# Pydantic models for request bodies
class RegisterModel(BaseModel):
    username: str
    password: str

class LoginModel(BaseModel):
    username: str
    password: str

# Example in-memory "database"
fake_users_db = {}

@router.post("/register")
def register(user: RegisterModel):
    if user.username in fake_users_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User exists")
    fake_users_db[user.username] = user.password
    return {"message": "User registered successfully!"}

@router.post("/login")
def login(user: LoginModel):
    stored_password = fake_users_db.get(user.username)
    if not stored_password or stored_password != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return {"message": "Logged in successfully!"}
