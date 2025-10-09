from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.routers.auth_router import get_current_user
from sqlalchemy.orm import selectinload
from pathlib import Path
# from datetime import datetime

from app.db.session import get_db
from app.models.library import Library
from app.schemas.library import LibraryCreate, LibraryResponse
from app.routers.auth_router import get_current_user
# from app.services.s3_utils import upload_base64_to_s3
from app.services.s3_utils import upload_file_to_s3

# ROUTER ENDPOINT
router = APIRouter(prefix="/libraries", tags=["libraries"])

# -------------------------
# CREATE A NEW LIBRARY (protected)
# -------------------------
@router.post("/", response_model=LibraryResponse)
async def create_library(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Create a new library.
    Accepts title, description, and optional image file upload.
    """
    # Get project root dynamically
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    default_image_path = BASE_DIR / "static" / "default_library.png"

    if image:
        try:
            image_url = upload_file_to_s3(image, user_id=str(current_user.id))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    else:
        try:
            # Use dynamic Path for default image
            with open(default_image_path, "rb") as f:
                default_upload = UploadFile(
                    filename="default_library.png",
                    file=f  # remove content_type
                )
                image_url = upload_file_to_s3(default_upload, user_id="default", folder="libraryDefaults/")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload default image: {str(e)}")

    new_library = Library(
        title=title,
        description=description,
        image_url=image_url,
        user_id=current_user.id,
    )

    db.add(new_library)
    await db.commit()
    await db.refresh(new_library)
    return new_library
# -------------------------
# GET ALL LIBRARIES (protected but public for logged-in users)
# -------------------------
@router.get("/", response_model=List[LibraryResponse])
async def get_all_libraries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Library).options(selectinload(Library.user)))
    return result.scalars().all()


# -------------------------
# GET CURRENT USER LIBRARIES (CRUD only for owner)
# -------------------------
@router.get("/mine", response_model=List[LibraryResponse])
async def get_my_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),  # leave type hint optional
):
    result = await db.execute(
        select(Library).where(Library.user_id == current_user.id)
    )
    return result.scalars().all()



# -------------------------
# UPDATE LIBRARY (owner only)
# -------------------------
@router.put("/{library_id}", response_model=LibraryResponse)
async def update_library(
    library_id: int,
    data: LibraryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(Library).where(Library.id == library_id, Library.user_id == current_user["id"])
    )
    library = result.scalar_one_or_none()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")

    library.title = data.title
    library.description = data.description
    if data.image_base64:
        library.image_url = upload_base64_to_s3(data.image_base64, folder="library default images")

    db.add(library)
    await db.commit()
    await db.refresh(library)
    return library


# -------------------------
# DELETE LIBRARY (owner only)
# -------------------------
@router.delete("/{library_id}")
async def delete_library(
    library_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(Library).where(Library.id == library_id, Library.user_id == current_user.id)
    )
    library = result.scalar_one_or_none()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")

    await db.delete(library)
    await db.commit()
    return {"detail": "Library deleted"}
