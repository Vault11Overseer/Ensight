# backend/app/routes/albums.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.album import Album
from app.models.user import User
from app.models.image import Image
from app.schemas.album import AlbumCreate, AlbumRead, AlbumUpdate
from app.schemas.image import ImageRead
from app.auth.dev_auth import get_current_user
from app.routes.images import _format_images_response

router = APIRouter(prefix="/albums", tags=["Albums"])


# =========================
# HELPER FUNCTION
# =========================
def _format_album_response(album: Album) -> dict:
    """Format album for response with image_ids"""
    image_ids = [img.id for img in album.images]
    return AlbumRead(
        id=album.id,
        title=album.title,
        description=album.description,
        owner_user_id=album.owner_user_id,
        is_master=album.is_master,
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
def create_album(
    data: AlbumCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can create their own albums.
    Admins can create albums for any user (future: via owner_user_id param).
    """
    album = Album(
        title=data.title,
        description=data.description,
        owner_user_id=current_user.id,
        is_master=False,  # Explicitly prevent gallery creation
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

    return album


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
def update_album(
    album_id: int,
    data: AlbumUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can only update their own albums.
    Admins can update any album.
    """
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Admin can update any album, users can only update their own
    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if data.title is not None:
        album.title = data.title
    if data.description is not None:
        album.description = data.description

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
