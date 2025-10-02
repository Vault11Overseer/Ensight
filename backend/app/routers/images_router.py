# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.db.session import get_db
# from app.routers.auth_router import get_current_user
# from app.models.image import Image
# from app.schemas.image import ImageCreate, ImageOut
# from app.core.aws import s3_upload_file, rekognition_detect_labels
# from app.core.auth import get_current_user
# import boto3
# import uuid

# router = APIRouter()
# @router.post("/images/upload", response_model=ImageOut)
# async def upload_image(
#     file: UploadFile = File(...),
#     db: AsyncSession = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     """
#     Uploads an image to S3, runs Rekognition, stores in DB.
#     Metadata (title, description, tags, library_id) can be updated later via JSON.
#     """

#     # 1️⃣ Upload file to S3
#     s3_url = await s3_upload_file(file, current_user.id)

#     # 2️⃣ Detect AI tags using AWS Rekognition
#     ai_tags = await rekognition_detect_labels(s3_url)

#     # 3️⃣ Create image DB record (basic info only for now)
#     new_image = Image(
#         user_id=current_user.id,
#         library_id=None,  # user can set later
#         url=s3_url,
#         title=file.filename,  # default until user updates
#         description=None,
#         tags=",".join(ai_tags),
#         is_public=True,
#     )
#     db.add(new_image)
#     await db.commit()
#     await db.refresh(new_image)

#     return new_image


# @router.post("/images/{image_id}/metadata", response_model=ImageOut)
# async def update_image_metadata(
#     image_id: int,
#     metadata: ImageCreate,
#     db: AsyncSession = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     """
#     Update image metadata (title, description, tags, library).
#     JSON-only endpoint.
#     """

#     image = await db.get(Image, image_id)
#     if not image or image.user_id != current_user.id:
#         raise HTTPException(status_code=404, detail="Image not found")

#     image.title = metadata.title
#     image.description = metadata.description
#     image.library_id = metadata.library_id
#     image.tags = ",".join(metadata.tags)

#     await db.commit()
#     await db.refresh(image)

#     return image


# images_router.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
# from app.core.auth import get_current_user
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageOut
from app.core.aws import s3_upload_file, rekognition_detect_labels
from app.routers.auth_router import get_current_user


router = APIRouter()

@router.post("/upload", response_model=ImageOut)
async def upload_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Uploads image to S3.
    Optional: library can be assigned later.
    """

    s3_url = await s3_upload_file(file, current_user.id)
    ai_tags = await rekognition_detect_labels(s3_url)

    new_image = Image(
        user_id=current_user.id,
        library_id=None,          # Optional
        url=s3_url,
        title=file.filename,
        description=None,
        tags=",".join(ai_tags),
        is_public=True,
    )
    db.add(new_image)
    await db.commit()
    await db.refresh(new_image)

    return new_image



@router.post("/{image_id}/metadata", response_model=ImageOut)
async def update_image_metadata(
    image_id: int,
    metadata: ImageCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    image = await db.get(Image, image_id)
    if not image or image.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Image not found")

    image.title = metadata.title
    image.description = metadata.description
    image.library_id = metadata.library_id
    image.tags = ",".join(metadata.tags)

    await db.commit()
    await db.refresh(image)

    return image
