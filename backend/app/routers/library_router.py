from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.library import Library
from app.routers.auth_router import get_current_user
from app.schemas.library import LibraryResponse as LibraryOut 

router = APIRouter()

@router.get("/", response_model=list[LibraryOut])
async def get_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Returns all libraries for the logged-in user.
    """
    print("Current user payload:", current_user)  # see what's returned
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid JWT token")
    result = await db.execute(select(Library).where(Library.user_id == current_user.id))
    libraries = result.scalars().all()
    return libraries