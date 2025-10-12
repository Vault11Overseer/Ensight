# images_router.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.session import get_db
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageOut
from app.routers.auth_router import get_current_user
from app.services.s3_utils import upload_file_to_s3, rekognition_detect_labels, get_s3_client
from app.models.user import User
from app.models.library import Library
import boto3
import os
import uuid
from datetime import datetime

router = APIRouter()
s3 = get_s3_client()


@router.post("/upload", response_model=ImageOut)
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    tags: str = Form(""),
    library_id: int = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_full_name = f"{current_user.first_name} {current_user.last_name}"
    try:
        # 🔹 Upload to S3
        bucket_name = "pynsight"
        # Sanitize user names
        safe_name = f"{current_user.first_name}_{current_user.last_name}".replace(" ", "_")
        file_key = f"uploads/{safe_name}/{uuid.uuid4()}_{file.filename}"

        s3.upload_fileobj(file.file, bucket_name, file_key)
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"

        # 🔹 Convert tags to list
        tag_list = []
        if tags:
            tag_list = [t.strip() for t in tags.split(",") if t.strip()]

        # 🔹 Save to database
        new_image = Image(
            title=title,
            description=description,
            url=s3_url,
            tags=",".join(tag_list),  # ⚡ store as string to fix SQLite
            user_id=current_user.id,
            library_id=library_id,
            created_at=datetime.utcnow(),
        )

        db.add(new_image)
        await db.commit()
        await db.refresh(new_image)

        # 🔹 Return image response safely
        image_dict = new_image.__dict__
        # Convert stored string back to list for API response
        if isinstance(image_dict.get("tags"), str):
            image_dict["tags"] = [t.strip() for t in image_dict["tags"].split(",") if t.strip()]

        # Optionally include user full name in response
        image_dict["user_name"] = user_full_name

        return image_dict

    except Exception as e:
        print("❌ Upload error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/{image_id}/metadata", response_model=ImageOut)
async def update_image_metadata(
    image_id: int,
    metadata: ImageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image = await db.get(Image, image_id)
    if not image or image.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Image not found")

    image.title = metadata.title
    image.description = metadata.description
    image.library_id = metadata.library_id
    image.tags = ",".join(metadata.tags)  # store as string for SQLite

    await db.commit()
    await db.refresh(image)

    # Convert tags string back to list for API response
    image_dict = image.__dict__
    if isinstance(image_dict.get("tags"), str):
        image_dict["tags"] = [t.strip() for t in image_dict["tags"].split(",") if t.strip()]

    return image_dict



@router.get("/mine", response_model=list[ImageOut])
async def get_my_images(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = await db.execute(
            select(
                Image.id,
                Image.url,
                Image.title,
                Image.description,
                Image.tags,
                Image.user_id,
                Image.library_id,
                Image.created_at,
                func.concat(User.first_name, " ", User.last_name).label("user_name"),
                Library.title.label("library_title")
            )
            .join(User, User.id == Image.user_id)
            .outerjoin(Library, Library.id == Image.library_id)
            .where(Image.user_id == current_user.id)
        )

        images = [dict(row._mapping) for row in result.all()]

        # 🩹 Convert comma-separated tags into a list
        for img in images:
            if isinstance(img.get("tags"), str):
                img["tags"] = [t.strip() for t in img["tags"].split(",") if t.strip()]

        return images

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Fetch all images for "All Images"
@router.get("/", response_model=list[ImageOut])
async def get_all_images(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            Image.id,
            Image.url,
            Image.title,
            Image.description,
            Image.tags,
            Image.user_id,
            Image.library_id,
            Image.created_at,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            Library.title.label("library_title")
        )
        .join(User, User.id == Image.user_id)
        .outerjoin(Library, Library.id == Image.library_id)
    )
    images = [dict(row._mapping) for row in result.all()]

    # 🩹 Convert comma-separated tags into a list
    for img in images:
        if isinstance(img.get("tags"), str):
            img["tags"] = [t.strip() for t in img["tags"].split(",") if t.strip()]

    return images
