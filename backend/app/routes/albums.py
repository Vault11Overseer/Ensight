# backend/app/routes/albums.py

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from pathlib import Path

from app.database.db import get_db
from app.models.album import Album
from app.models.user import User
from app.models.image import Image
from app.schemas.album import AlbumCreate, AlbumRead, AlbumUpdate
from app.schemas.image import ImageRead
from app.auth.dev_auth import get_current_user
from app.routes.images import _format_images_response
from app.auth.s3 import upload_file_to_s3, get_s3_url, delete_s3_object, generate_signed_url

router = APIRouter(prefix="/albums", tags=["Albums"])


# =========================
# HELPER FUNCTION
# =========================
def _format_album_response(album: Album) -> AlbumRead:
    """Format album for response with image_ids and cover_image_url"""
    image_ids = [img.id for img in album.images]
    cover_image_url = None
    if album.cover_image_s3_key:
        cover_image_url = generate_signed_url(album.cover_image_s3_key)
    
    return AlbumRead(
        id=album.id,
        title=album.title,
        description=album.description,
        owner_user_id=album.owner_user_id,
        is_master=album.is_master,
        cover_image_s3_key=album.cover_image_s3_key,
        cover_image_url=cover_image_url,
        created_at=album.created_at,
        updated_at=album.updated_at,
        image_ids=image_ids,
    )


# =========================
# LIST ALBUMS (PUBLIC - all users can view)
# =========================
@router.get("/", response_model=List[AlbumRead])
def list_albums(db: Session = Depends(get_db)):
    """
    Public-readable albums.
    Users can view all albums created by other users.
    """
    albums = db.query(Album).all()
    return [_format_album_response(album) for album in albums]


# =========================
# CREATE ALBUM (Users can only create their own albums)
# =========================
@router.post("/", response_model=AlbumRead)
async def create_album(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    default_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can create their own albums.
    Admins can create albums for any user (future: via owner_user_id param).
    Accepts multipart/form-data with title, description, and optional default_image file.
    """
    cover_image_s3_key = None
    
    # Create folder path: insight-render/default_album_images/{first_name}_{last_name}/album_name/
    user_folder = f"{current_user.first_name}_{current_user.last_name}".replace(" ", "_")
    album_folder = title.replace(" ", "_").replace("/", "_")  # Sanitize album name
    s3_folder = f"album_images/{user_folder}/{album_folder}/"
    
    if default_image and default_image.filename:
        # User provided a custom image
        try:
            cover_image_s3_key, _ = upload_file_to_s3(
                default_image,
                current_user.id,
                folder=s3_folder
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload cover image: {str(e)}")
    else:
        # Use default album image from public folder
        default_image_path = Path(__file__).parent.parent.parent.parent / "frontend" / "public" / "default_album_image.png"
        
        if default_image_path.exists():
            try:
                from io import BytesIO
                from tempfile import SpooledTemporaryFile
                
                # Read the default image file
                with open(default_image_path, "rb") as f:
                    file_content = f.read()
                
                # Create a file-like object that works with boto3
                file_obj = BytesIO(file_content)
                
                # Create a mock UploadFile-like object
                class DefaultImageFile:
                    def __init__(self, content, filename):
                        self.file = content
                        self.filename = filename
                        self.content_type = "image/png"
                
                default_file = DefaultImageFile(file_obj, "default_album_image.png")
                
                cover_image_s3_key, _ = upload_file_to_s3(
                    default_file,
                    current_user.id,
                    folder=s3_folder
                )
            except Exception as e:
                # If default image upload fails, continue without cover image
                print(f"Warning: Failed to upload default album image: {e}")
                cover_image_s3_key = None
    
    album = Album(
        title=title,
        description=description,
        owner_user_id=current_user.id,
        is_master=False,  # Explicitly prevent gallery creation
        cover_image_s3_key=cover_image_s3_key,
    )
    db.add(album)
    db.commit()
    db.refresh(album)
    return _format_album_response(album)


# =========================
# READ SINGLE ALBUM (PUBLIC - all users can view)
# =========================
@router.get("/{album_id}", response_model=AlbumRead)
def get_album(album_id: int, db: Session = Depends(get_db)):
    """
    Users can view albums created by other users.
    """
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    return _format_album_response(album)


# =========================
# GET ALBUM IMAGES
# =========================
@router.get("/{album_id}/images", response_model=List[ImageRead])
def get_album_images(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all images in an album.
    All authenticated users can view images in any album.
    """
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    images = album.images
    return _format_images_response(images, db)


# =========================
# UPDATE ALBUM (Users can only update their own, admins can update any)
# =========================
@router.put("/{album_id}", response_model=AlbumRead)
async def update_album(
    album_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    default_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can only update their own albums.
    Admins can update any album.
    Accepts multipart/form-data with optional title, description, and default_image file.
    """
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Admin can update any album, users can only update their own
    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if title is not None:
        album.title = title
    if description is not None:
        album.description = description
    
    # Handle cover image update
    if default_image and default_image.filename:
        # Delete old cover image from S3 if it exists
        if album.cover_image_s3_key:
            try:
                delete_s3_object(album.cover_image_s3_key)
            except Exception as e:
                print(f"Warning: Failed to delete old cover image: {e}")
        
        # Upload new cover image
        user_folder = f"{current_user.first_name}_{current_user.last_name}".replace(" ", "_")
        album_folder = (album.title or title or "untitled").replace(" ", "_").replace("/", "_")
        s3_folder = f"album_images/{user_folder}/{album_folder}/"
        
        try:
            cover_image_s3_key, _ = upload_file_to_s3(
                default_image,
                current_user.id,
                folder=s3_folder
            )
            album.cover_image_s3_key = cover_image_s3_key
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload cover image: {str(e)}")

    db.commit()
    db.refresh(album)
    return _format_album_response(album)


# =========================
# DELETE ALBUM (Users can only delete their own, admins can delete any)
# =========================
@router.delete("/{album_id}")
def delete_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can only delete their own albums.
    Admins can delete any album.
    Note: Deleting an album does not delete the images, only the album-image associations.
    """
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Admin can delete any album, users can only delete their own
    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(album)
    db.commit()
    return {"detail": "Album deleted"}
