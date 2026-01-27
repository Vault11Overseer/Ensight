# backend/app/routes/images.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
import secrets

from app.database.db import get_db
from app.models.image import Image
from app.models.user import User
from app.models.tag import Tag
from app.models.album import Album
from app.models.image_tag import image_tags
from app.models.image_album import image_albums
from app.schemas.image import ImageCreate, ImageRead, ImageUpdate
from app.auth.dev_auth import get_current_user
from app.auth.s3 import upload_file_to_s3, delete_s3_object, rekognition_detect_labels, get_s3_url

router = APIRouter(prefix="/images", tags=["Images"])


# =========================
# LIST ALL IMAGES (Gallery - all users can view)
# =========================
@router.get("/", response_model=List[ImageRead])
def list_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    """
    All authenticated users can view all images in the Gallery.
    """
    images = db.query(Image).offset(skip).limit(limit).all()
    return _format_images_response(images, db)


# =========================
# LIST IMAGES FOR CURRENT USER
# =========================
@router.get("/user", response_model=List[ImageRead])
def list_user_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    """
    Returns images uploaded by the current authenticated user.
    """
    images = (
        db.query(Image)
        .filter(Image.uploader_user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return _format_images_response(images, db)


# =========================
# GET SINGLE IMAGE (All users can view)
# =========================
@router.get("/{image_id}", response_model=ImageRead)
def get_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    All authenticated users can view any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return _format_image_response(image, db)


# =========================
# CREATE IMAGE (Users can create their own)
# =========================
@router.post("/", response_model=ImageRead)
async def create_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    album_ids: Optional[str] = Form(None),  # Comma-separated IDs
    user_tags: Optional[str] = Form(None),  # Comma-separated tags
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can upload and create their own images.
    Images are automatically added to the Gallery.
    """
    # Upload to S3
    # Build a user folder using the user's full name. Sanitize to avoid unsafe characters.
    def _sanitize_name(name: str) -> str:
        return "".join(c for c in name.strip().lower() if c.isalnum() or c in ("-", "_", " ")).replace(" ", "_")

    first = current_user.first_name or "user"
    last = current_user.last_name or str(current_user.id)
    user_folder = f"uploads/{_sanitize_name(first)}_{_sanitize_name(last)}/"

    try:
        s3_key, s3_url = upload_file_to_s3(file, current_user.id, folder=user_folder)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Create image record
    image = Image(
        uploader_user_id=current_user.id,
        s3_key=s3_key,
        title=title,
        description=description,
    )
    db.add(image)
    db.flush()  # Get the image ID

    # Associate with albums if provided
    if album_ids:
        album_id_list = [int(id.strip()) for id in album_ids.split(",") if id.strip()]
        for album_id in album_id_list:
            album = db.get(Album, album_id)
            if album:
                # Check permission: user owns album or is admin
                if current_user.role != "admin" and album.owner_user_id != current_user.id:
                    continue  # Skip unauthorized albums
                image.albums.append(album)

    # Process user tags
    if user_tags:
        tag_list = [tag.strip() for tag in user_tags.split(",") if tag.strip()]
        for tag_name in tag_list:
            tag = db.query(Tag).filter(Tag.name == tag_name.lower()).first()
            if not tag:
                tag = Tag(name=tag_name.lower(), source="user")
                db.add(tag)
            image.tags.append(tag)

    # Generate AWS Rekognition tags
    try:
        aws_labels = rekognition_detect_labels(s3_key)
        for label_name in aws_labels:
            tag = db.query(Tag).filter(Tag.name == label_name.lower()).first()
            if not tag:
                tag = Tag(name=label_name.lower(), source="aws")
                db.add(tag)
            if tag not in image.tags:
                image.tags.append(tag)
    except Exception as e:
        # Don't fail if Rekognition fails
        print(f"Rekognition failed: {e}")

    db.commit()
    db.refresh(image)
    return _format_image_response(image, db)


# =========================
# UPDATE IMAGE (Users can update their own, admins can update any)
# =========================
@router.put("/{image_id}", response_model=ImageRead)
def update_image(
    image_id: int,
    data: ImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can only update their own images.
    Admins can update any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Check permission
    if current_user.role != "admin" and image.uploader_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Update fields
    if data.title is not None:
        image.title = data.title
    if data.description is not None:
        image.description = data.description
    if data.camera_make is not None:
        image.camera_make = data.camera_make
    if data.camera_model is not None:
        image.camera_model = data.camera_model
    if data.lens is not None:
        image.lens = data.lens
    if data.focal_length is not None:
        image.focal_length = data.focal_length
    if data.aperture is not None:
        image.aperture = data.aperture
    if data.shutter_speed is not None:
        image.shutter_speed = data.shutter_speed
    if data.iso is not None:
        image.iso = data.iso
    if data.gps_latitude is not None:
        image.gps_latitude = data.gps_latitude
    if data.gps_longitude is not None:
        image.gps_longitude = data.gps_longitude
    if data.location_name is not None:
        image.location_name = data.location_name
    if data.captured_at is not None:
        image.captured_at = data.captured_at
    if data.image_metadata is not None:
        image.image_metadata = data.image_metadata
    if data.watermark_enabled is not None:
        image.watermark_enabled = data.watermark_enabled

    db.commit()
    db.refresh(image)
    return _format_image_response(image, db)


# =========================
# DELETE IMAGE (Users can delete their own, admins can delete any)
# =========================
@router.delete("/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can only delete their own images.
    Admins can delete any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Check permission
    if current_user.role != "admin" and image.uploader_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Delete from S3
    try:
        delete_s3_object(image.s3_key)
        if image.preview_key:
            delete_s3_object(image.preview_key)
    except Exception as e:
        print(f"Error deleting S3 objects: {e}")

    db.delete(image)
    db.commit()
    return {"detail": "Image deleted"}


# =========================
# ADD IMAGE TO ALBUM
# =========================
@router.post("/{image_id}/albums/{album_id}")
def add_image_to_album(
    image_id: int,
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can add images to their own albums.
    Admins can add any image to any album.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Check permission: user owns album or is admin
    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if album not in image.albums:
        image.albums.append(album)
        db.commit()

    return {"detail": "Image added to album"}


# =========================
# REMOVE IMAGE FROM ALBUM
# =========================
@router.delete("/{image_id}/albums/{album_id}")
def remove_image_from_album(
    image_id: int,
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can remove images from their own albums.
    Admins can remove any image from any album.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Check permission: user owns album or is admin
    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if album in image.albums:
        image.albums.remove(album)
        db.commit()

    return {"detail": "Image removed from album"}


# =========================
# ADD TAG TO IMAGE
# =========================
@router.post("/{image_id}/tags")
def add_tag_to_image(
    image_id: int,
    tag_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can add tags to their own images.
    Admins can add tags to any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Check permission
    if current_user.role != "admin" and image.uploader_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    tag = db.query(Tag).filter(Tag.name == tag_name.lower()).first()
    if not tag:
        tag = Tag(name=tag_name.lower(), source="user")
        db.add(tag)

    if tag not in image.tags:
        image.tags.append(tag)
        db.commit()

    return {"detail": "Tag added to image"}


# =========================
# REMOVE TAG FROM IMAGE
# =========================
@router.delete("/{image_id}/tags/{tag_id}")
def remove_tag_from_image(
    image_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can remove tags from their own images.
    Admins can remove tags from any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Check permission
    if current_user.role != "admin" and image.uploader_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if tag in image.tags:
        image.tags.remove(tag)
        db.commit()

    return {"detail": "Tag removed from image"}


# =========================
# HELPER FUNCTIONS
# =========================
def _format_image_response(image: Image, db: Session) -> dict:
    """Format a single image for response"""
    album_ids = [album.id for album in image.albums]
    tag_names = [tag.name for tag in image.tags]
    
    return ImageRead(
        id=image.id,
        uploader_user_id=image.uploader_user_id,
        s3_key=image.s3_key,
        s3_url=get_s3_url(image.s3_key),
        preview_key=image.preview_key,
        preview_url=get_s3_url(image.preview_key) if image.preview_key else None,
        title=image.title,
        description=image.description,
        image_metadata=image.image_metadata,
        camera_make=image.camera_make,
        camera_model=image.camera_model,
        lens=image.lens,
        focal_length=image.focal_length,
        aperture=image.aperture,
        shutter_speed=image.shutter_speed,
        iso=image.iso,
        gps_latitude=image.gps_latitude,
        gps_longitude=image.gps_longitude,
        location_name=image.location_name,
        captured_at=image.captured_at,
        created_at=image.created_at,
        updated_at=image.updated_at,
        watermark_enabled=image.watermark_enabled,
        album_ids=album_ids,
        tag_names=tag_names,
    )


def _format_images_response(images: List[Image], db: Session) -> List[dict]:
    """Format multiple images for response"""
    return [_format_image_response(image, db) for image in images]
