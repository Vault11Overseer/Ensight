from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from .security import hash_password, verify_password, verify_token, create_access_token, create_refresh_token
from datetime import timedelta

router = APIRouter()

# temporary in-memory "DB"
fake_users = {}

class UserRegister(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user: UserRegister):
    if user.email in fake_users:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = hash_password(user.password)
    fake_users[user.email] = {"email": user.email, "password": hashed}
    return {"msg": "User registered"}



class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(user: UserLogin):
    db_user = fake_users.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token({"sub": user.email}, access_token_expires)
    refresh_token = create_refresh_token({"sub": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
    
    
#REFRESH ENDPOINT    
@router.post("/refresh")
def refresh_token(refresh_token: str):
    payload = verify_token(refresh_token, scope="refresh_token")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    new_access = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_access, "token_type": "bearer"}