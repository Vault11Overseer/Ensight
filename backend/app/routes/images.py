# backend/app/routes/images.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.db import get_db
from app.models.image import Image
from app.models.image_access import ImageAccessRules
from app.models.album import Album
from app.models.share_link import ShareLink

router = APIRouter(prefix="/images", tags=["Images"])

# =========================
# Pydantic Schemas
# =========================
from pydantic import BaseModel

class ImageCreate(BaseModel):
    album_ids: list[int] = []  # new
    metadata: dict | None = {}
    watermark_required: bool = False

class ImageRead(BaseModel):
    id: int
    user_id: int
    s3_key: str
    metadata: dict
    created_at: datetime
    updated_at: datetime | None
    album_id: int | None = None
    watermark_required: bool

    class Config:
        orm_mode = True

# =========================
# LIST IMAGES (everyone)
# =========================
@router.get("/", response_model=List[ImageRead])
def list_images(db: Session = Depends(get_db), current_user=Depends()):
    images = db.query(Image).all()
    results = []
    for img in images:
        access = db.query(ImageAccessRules).filter(ImageAccessRules.image_id == img.id).first()
        results.append(
            ImageRead(
                id=img.id,
                user_id=img.user_id,
                s3_key=img.s3_key,
                metadata=img.metadata or {},
                created_at=img.created_at,
                updated_at=img.updated_at,
                album_id=img.album_id if hasattr(img, "album_id") else None,
                watermark_required=access.watermark_required if access else False,
            )
        )
    return results

# =========================
# CREATE IMAGE
# =========================
@router.post("/", response_model=ImageRead)
def create_image(
    data: ImageCreate,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends()
):
    # TODO: Upload to S3 here, get s3_key
    s3_key = f"s3://bucket/{file.filename}"  # placeholder

    img = Image(
        user_id=current_user.id,
        s3_key=s3_key,
        metadata=data.metadata or {}
    )
    db.add(img)
    db.commit()
    db.refresh(img)

    # Master gallery logic already handled by default if you want

    # Add access rules
    access = ImageAccessRules(
        image_id=img.id,
        watermark_required=data.watermark_required
    )
    db.add(access)
    db.commit()
    db.refresh(access)

    return ImageRead(
        id=img.id,
        user_id=img.user_id,
        s3_key=img.s3_key,
        metadata=img.metadata,
        created_at=img.created_at,
        updated_at=img.updated_at,
        album_id=data.album_id,
        watermark_required=access.watermark_required,
    )

# =========================
# UPDATE IMAGE
# =========================
@router.put("/{image_id}", response_model=ImageRead)
def update_image(
    image_id: int,
    data: ImageCreate,
    db: Session = Depends(get_db),
    current_user=Depends()
):
    img = db.get(Image, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    if img.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    img.metadata = data.metadata or img.metadata
    if data.album_id:
        img.album_id = data.album_id

    # Update watermark
    access = db.query(ImageAccessRules).filter(ImageAccessRules.image_id == img.id).first()
    if access:
        access.watermark_required = data.watermark_required
    else:
        access = ImageAccessRules(image_id=img.id, watermark_required=data.watermark_required)
        db.add(access)

    db.commit()
    db.refresh(img)
    return ImageRead(
        id=img.id,
        user_id=img.user_id,
        s3_key=img.s3_key,
        metadata=img.metadata,
        created_at=img.created_at,
        updated_at=img.updated_at,
        album_id=getattr(img, "album_id", None),
        watermark_required=access.watermark_required,
    )

# =========================
# DELETE IMAGE
# =========================
@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db), current_user=Depends()):
    img = db.get(Image, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    if img.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Delete access rules
    db.query(ImageAccessRules).filter(ImageAccessRules.image_id == img.id).delete()
    # Delete image
    db.delete(img)
    db.commit()
    return {"detail": "Image deleted"}
