# backend/app/utils/auth.py

from passlib.context import CryptContext

# =========================
# Password hashing context
# =========================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# Hash a plain password
# =========================
def hash_password(password: str) -> str:
    if not isinstance(password, str):
        raise TypeError("Password must be a string")

    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password exceeds bcrypt 72-byte limit")

    return pwd_context.hash(password)
# =========================
# Verify password
# =========================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies that the plain password matches the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)
