# images_router.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from sqlalchemy.future import select
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageOut
from app.routers.auth_router import get_current_user
from app.services.s3_utils import upload_file_to_s3, rekognition_detect_labels
from app.models.user import User
from app.models.library import Library

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

    # s3_url = await s3_upload_file(file, current_user.id)
    s3_url = upload_file_to_s3(file, current_user.id)
    # Get AI tags safely
    ai_tags = rekognition_detect_labels(s3_url) or []
    tags_str = ",".join(ai_tags)
    
    # Ensure title and description
    title = file.filename or "Untitled"
    description = ""

    # Create DB entry
    new_image = Image(
        user_id=current_user.id,
        library_id=None,
        url=s3_url,
        title=file.filename or "Untitled",
        description="",
        tags=tags_str,
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


@router.get("/mine", response_model=list[ImageOut])
async def get_my_images(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
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
            ).where(Image.user_id == current_user.id)
        )

        images = []
        for row in result.all():
            row_dict = dict(row._mapping)
            tags = row_dict.get("tags")
            if tags and isinstance(tags, str):
                row_dict["tags"] = [t.strip() for t in tags.split(",") if t.strip()]
            else:
                row_dict["tags"] = []

            images.append(row_dict)

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
            User.username.label("user_name"),
            Library.title.label("library_title")
        ).join(User, User.id == Image.user_id)
         .outerjoin(Library, Library.id == Image.library_id)
    )
    images = [dict(row._mapping) for row in result.all()]
    return images