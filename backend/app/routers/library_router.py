from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.db.session import get_db
from app.models.library import Library
from app.schemas.library import LibraryCreate, LibraryResponse
from app.routers.auth_router import get_current_user
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.library import Library
from app.services.s3_utils import upload_base64_to_s3
router = APIRouter(prefix="/libraries", tags=["libraries"])
from pydantic import BaseModel

class LibraryCreate(BaseModel):
    title: str
    description: str
    image_base64: str | None = None
    
# Get all libraries for the current user
@router.get("/", response_model=List[LibraryResponse])
async def get_my_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Library).where(Library.user_id == current_user.id))
    return result.scalars().all()


# Get libraries made by other users
@router.get("/others", response_model=List[LibraryResponse])
async def get_other_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Library).where(Library.user_id != current_user.id))
    return result.scalars().all()


# Create a new library
@router.post("/libraries/")
async def create_library(data: LibraryCreate, db: AsyncSession = Depends(get_db)):
    image_url = None
    if data.image_base64:
        try:
            image_url = upload_base64_to_s3(data.image_base64)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid image data")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    new_library = Library(title=data.title, description=data.description, image_url=image_url)
    db.add(new_library)
    await db.commit()
    await db.refresh(new_library)
    return new_library