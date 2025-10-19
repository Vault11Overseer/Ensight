# backend/app/routers/library_router.py

# ======================================
# LIBRARY ROUTER
# ======================================

# ======================================
# IMPORTS
# ======================================
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.routers.auth_router import get_current_user
from sqlalchemy.orm import selectinload
from pathlib import Path
from io import BytesIO
from functools import partial
from app.db.session import get_db
from app.models.library import Library
from app.schemas.library import LibraryCreate, LibraryResponse
from app.routers.auth_router import get_current_user
from app.core.s3_utils import upload_file_to_s3
import asyncio
import uuid



# ======================================
# ROUTER ENDPOINT
# ======================================
router = APIRouter(prefix="/libraries", tags=["libraries"])


# ======================================
# CREATE A NEW LIBRARY
# ======================================
@router.post("/", response_model=LibraryResponse)
async def create_library(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    default_image_path = BASE_DIR / "static" / "default_library.png"

    # IF USER UPLOADED AN IMAGE -> UPLOAD TO S3
    if image:
        try:
            loop = asyncio.get_running_loop()
            # STORE USER UPLOADED LIBRARY IMAGE IN DEFAULTLIBRARY
            upload_task = partial(upload_file_to_s3, image, user_id=str(current_user.id), folder="defaultImages/")
            image_url = await loop.run_in_executor(None, upload_task)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    # IF NO IMAGE -> USE BACKEND STATIC PATH
    else:
        if not default_image_path.exists():
            raise HTTPException(status_code=404, detail="Default library image not found on server.")
        image_url = "http://localhost:8000/static/default_library.png"

    # CREATE LIBRARY RECORD
    new_library = Library(
        title=title,
        description=description,
        image_url=image_url,
        user_id=uuid.UUID(str(current_user.id)),
    )

    db.add(new_library)
    await db.commit()
    await db.refresh(new_library)

    return LibraryResponse(
        id=new_library.id,
        title=new_library.title,
        description=new_library.description,
        image_url=new_library.image_url,
        user_id=new_library.user_id,
        created_at=new_library.created_at,
        user_name=f"{current_user.first_name} {current_user.last_name}"
    )



# ======================================
# GET ALL LIBRARIES (PROTECTED)
# ======================================
@router.get("/", response_model=List[LibraryResponse])
async def get_all_libraries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Library).options(selectinload(Library.user)))
    libraries = result.scalars().all()

    return [
        LibraryResponse(
            id=lib.id,
            title=lib.title,
            description=lib.description,
            image_url=lib.image_url,
            user_id=lib.user_id,
            created_at=lib.created_at,
            user_name=f"{lib.user.first_name} {lib.user.last_name}" if lib.user else "Unknown"
        )
        for lib in libraries
    ]


# ======================================
# GET CURRENT USER LIBRARIES (PROTECTED)
# ======================================
@router.get("/mine", response_model=List[LibraryResponse])
async def get_my_libraries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    result = await db.execute(
    select(Library).where(Library.user_id == uuid.UUID(str(current_user.id)))  # ✅ convert
)

    libraries = result.scalars().all()

    # MAP TO RESPONSE SCHEMA INCLUDING USER_NAME
    return [
        LibraryResponse(
            id=lib.id,
            title=lib.title,
            description=lib.description,
            image_url=lib.image_url,
            user_id=lib.user_id,
            created_at=lib.created_at,
            user_name=f"{current_user.first_name} {current_user.last_name}"
        )
        for lib in libraries
    ]



# ======================================
# UPDATE LIBRARY (PROTECTED)
# ======================================
@router.put("/{library_id}", response_model=LibraryResponse)
async def update_library(
    library_id: int,
    title: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # FETCH LIBRARY
    result = await db.execute(
        select(Library).where(Library.id == library_id, Library.user_id == uuid.UUID(str(current_user.id)))

    )
    library = result.scalar_one_or_none()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")

    # UPDATE TITLE AND DESCRIPTION
    library.title = title
    library.description = description

    # HANDLE IMAGE UPDATE
    if image:
        # IF USER UPLOADS A FILE
        loop = asyncio.get_running_loop()
        upload_task = partial(upload_file_to_s3, image, user_id=str(current_user.id))
        library.image_url = await loop.run_in_executor(None, upload_task)
    elif image_base64:
        # IF USER SENT A BASE64 STRING
        loop = asyncio.get_running_loop()
        upload_task = partial(upload_file_to_s3, image_base64, user_id=str(current_user.id))
        library.image_url = await loop.run_in_executor(None, upload_task)

    db.add(library)
    await db.commit()
    await db.refresh(library)
    return library


# ======================================
# DELETE LIBRARY (PROTECTED)
# ======================================
@router.delete("/{library_id}")
async def delete_library(
    library_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(Library).where(Library.id == library_id, Library.user_id == uuid.UUID(str(current_user.id)))

    )
    library = result.scalar_one_or_none()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")

    await db.delete(library)
    await db.commit()
    return {"detail": "Library deleted"}
