from passlib.context import CryptContext
from datetime import timedelta
from typing import Optional
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    # your code here
    ...

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    # your code here
    ...

def verify_token(token: str):
    # your code here
    ...
