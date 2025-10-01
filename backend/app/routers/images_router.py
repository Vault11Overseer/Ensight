# from fastapi import APIRouter, Depends, UploadFile, HTTPException, File
# from sqlalchemy.ext.asyncio import AsyncSession
# from fastapi.responses import JSONResponse
# import os
# from pathlib import Path
# from app.db.database import get_db
# from app.services.s3_utils import upload_file_to_s3
# from .auth_router import get_current_user
# # from app import s3_utils



# UPLOAD_DIR = Path("uploads/images_router")
# UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# # router = APIRouter(prefix="/images_router", tags=["images"])
# router = APIRouter()

# @router.get("/example")
# async def example():
#     return {"msg": "hello"}



# @router.post("/upload")
# async def upload_image(file: UploadFile, current_user: dict = Depends(get_current_user)):
#     user_id = current_user["id"]
#     file_url = upload_file_to_s3(file, user_id)
#     return {"url": file_url}
  # app/routers/images.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.auth.auth_router import get_current_user
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageOut
import boto3
from app.core.aws import s3_upload_file, rekognition_detect_labels

router = APIRouter()

@router.post("/images/upload", response_model=ImageOut)
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(None),
    library_id: int = Form(None),
    tags: str = Form(None),  # comma-separated tags from user
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # 1️⃣ Upload file to S3
    s3_url = await s3_upload_file(file, current_user.id)

    # 2️⃣ Detect AI tags using AWS Rekognition
    ai_tags = await rekognition_detect_labels(s3_url)

    # 3️⃣ Merge user-provided tags with AI tags
    final_tags = set(tags.split(",") if tags else []).union(set(ai_tags))

    # 4️⃣ Save in DB
    new_image = Image(
        user_id=current_user.id,
        library_id=library_id,
        url=s3_url,
        title=title,
        description=description,
        tags=",".join(final_tags),
        is_public=True,
    )
    db.add(new_image)
    await db.commit()
    await db.refresh(new_image)
    return new_image
