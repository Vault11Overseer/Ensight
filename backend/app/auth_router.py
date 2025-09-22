from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db
from .models import User
from .schemas import UserCreate, UserOut
from .security import hash_password, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Register
@router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        f"SELECT * FROM users WHERE email = :email",
        {"email": user.email}
    )
    existing = result.fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

# Login
@router.post("/login")
async def login(user: LoginIn, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
        f"SELECT * FROM users WHERE email = :email",
        {"email": user.email}
        )
        db_user = result.fetchone()
        if not db_user or not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
            token = create_access_token({"sub": str(db_user.id)})
            return {"access_token": token, "token_type": "bearer"}
            return {"access_token": "token"}
    except Exception as e:
        print("Login error:", e)
        raise HTTPException(status_code=400, detail=str(e))

    

# Dependency to get current user
from fastapi import Request

async def get_current_user(token: str = Depends(oauth2_scheme)):
    from .security import decode_access_token
    payload = decode_access_token(token)
    user_id = int(payload.get("sub"))
    return {"id": user_id}
