from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.routers.auth_router import get_current_user
# from datetime import datetime

from app.db.session import get_db
from app.models.library import Library
from app.schemas.library import LibraryCreate, LibraryResponse
from app.routers.auth_router import get_current_user
from app.services.s3_utils import upload_base64_to_s3

# ROUTER ENDPOINT
router = APIRouter(prefix="/libraries", tags=["libraries"])
    
### GET ###    
# GET ALL USERS CURRENT LIBRARIES
@router.get("/", response_model=List[LibraryResponse])
async def get_my_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Library).where(Library.user_id == current_user.id))
    return result.scalars().all()


# GET LIBRARIES MADE BY OTHER USERS
@router.get("/others", response_model=List[LibraryResponse])
async def get_other_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Library).where(Library.user_id != current_user.id))
    return result.scalars().all()

### POST ###
# CREATE A NEW LIBRARY
@router.post("/", response_model=LibraryResponse)
async def create_library(
    data: LibraryCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: dict = Depends(get_current_user),
    ):
    
    image_url = None
    
    if data.image_base64:
        try:
            image_url = upload_base64_to_s3(
                data.image_base64,
                folder="library default images"   
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid image data")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    new_library = Library(
        title=data.title, 
        description=data.description, 
        image_url=image_url,
        user_id=current_user["id"]
    )
    
    db.add(new_library)
    await db.commit()
    await db.refresh(new_library)
    return new_library