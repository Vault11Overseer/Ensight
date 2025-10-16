# backend/app/core/security.py

# ======================================
# SECURITY
# ======================================

# ======================================
# IMPORTS
# ======================================
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.core.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from fastapi import HTTPException, status
from jose import jwt, JWTError

# ======================================
# CRYPT CONTEXT
# ======================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ======================================
# HAS PASSWORD
# ======================================
def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)

# ======================================
# VERIFY PASSWORD
# ======================================
def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    return pwd_context.verify(plain, hashed)

# ======================================
# CREATE ACCESS TOKEN
# ======================================
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    
    """Create a JWT access token with optional expiration."""

    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "token_type": "access"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

# ======================================
# DECODE ACCESS TOKEN
# ======================================
def decode_access_token(token: str):
    if not token or token.count(".") != 2:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed or missing JWT token",
        )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="JWT token expired")
    except InvalidSignatureError:
        raise HTTPException(status_code=401, detail="JWT signature verification failed")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired JWT token",
        )