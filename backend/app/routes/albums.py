from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.album import Album
from app.models.user import User
from app.schemas.album import AlbumCreate, AlbumRead, AlbumUpdate
from app.auth.dev_auth import get_current_user

router = APIRouter(prefix="/albums", tags=["Albums"])


# =========================
# LIST ALBUMS (PUBLIC)
# =========================
@router.get("/", response_model=List[AlbumRead])
def list_albums(db: Session = Depends(get_db)):
    """
    Public-readable albums.
    The Master Gallery is system-owned and excluded.
    """
    return (
        db.query(Album)
        .filter(Album.is_master.is_(False))  # ✅ KEY FIX
        .all()
    )


# =========================
# CREATE ALBUM
# =========================
@router.post("/", response_model=AlbumRead)
def create_album(
    data: AlbumCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    album = Album(
        title=data.title,
        description=data.description,
        owner_user_id=current_user.id,
        is_master=False,  # Explicitly prevent gallery creation
    )
    db.add(album)
    db.commit()
    db.refresh(album)
    return album


# =========================
# READ SINGLE ALBUM (PUBLIC)
# =========================
@router.get("/{album_id}", response_model=AlbumRead)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Prevent navigating directly to the Master Gallery
    if album.is_master:
        raise HTTPException(status_code=404, detail="Album not found")

    return album


# =========================
# UPDATE ALBUM
# =========================
@router.put("/{album_id}", response_model=AlbumRead)
def update_album(
    album_id: int,
    data: AlbumUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Protect the gallery
    if album.is_master:
        raise HTTPException(status_code=403, detail="Gallery cannot be edited")

    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if data.title is not None:
        album.title = data.title
    if data.description is not None:
        album.description = data.description

    db.commit()
    db.refresh(album)
    return album


# =========================
# DELETE ALBUM
# =========================
@router.delete("/{album_id}")
def delete_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    if album.is_master:
        raise HTTPException(status_code=400, detail="Gallery cannot be deleted")

    if current_user.role != "admin" and album.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(album)
    db.commit()
    return {"detail": "Album deleted"}
