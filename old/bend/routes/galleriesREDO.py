# backend/app/routes/galleries.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database.db import get_db
from app.models.gallery import Gallery
from app.models.album import Album

router = APIRouter(prefix="/galleries", tags=["Galleries"])

# =========================
# Pydantic Schemas
# =========================
class GalleryCreate(BaseModel):
    title: str
    description: str = ""
    sort_order: int = 0
    album_ids: List[int] = []

class GalleryRead(BaseModel):
    id: int
    title: str
    description: str
    created_by: int | None
    sort_order: int
    is_master: bool
    created_at: str
    updated_at: str | None
    album_ids: List[int] = []

    class Config:
        orm_mode = True

# =========================
# LIST ALL GALLERIES (viewable by everyone)
# =========================
@router.get("/", response_model=List[GalleryRead])
def list_galleries(db: Session = Depends(get_db)):
    galleries = db.query(Gallery).all()
    return [
        GalleryRead(
            id=g.id,
            title=g.title,
            description=g.description,
            created_by=g.created_by,
            sort_order=g.sort_order,
            is_master=g.is_master,
            created_at=g.created_at,
            updated_at=g.updated_at,
            album_ids=[a.id for a in g.albums] if hasattr(g, "albums") else []
        )
        for g in galleries
    ]

# =========================
# CREATE GALLERY
# =========================
@router.post("/", response_model=GalleryRead)
def create_gallery(data: GalleryCreate, db: Session = Depends(get_db), current_user=Depends()):
    gallery = Gallery(
        title=data.title,
        description=data.description,
        sort_order=data.sort_order,
        created_by=current_user.id,
    )
    if data.album_ids:
        albums = db.query(Album).filter(Album.id.in_(data.album_ids)).all()
        gallery.albums = albums
    db.add(gallery)
    db.commit()
    db.refresh(gallery)
    return GalleryRead(
        id=gallery.id,
        title=gallery.title,
        description=gallery.description,
        created_by=gallery.created_by,
        sort_order=gallery.sort_order,
        is_master=gallery.is_master,
        created_at=gallery.created_at,
        updated_at=gallery.updated_at,
        album_ids=[a.id for a in gallery.albums] if hasattr(gallery, "albums") else [],
    )

# =========================
# UPDATE GALLERY
# =========================
@router.put("/{gallery_id}", response_model=GalleryRead)
def update_gallery(gallery_id: int, data: GalleryCreate, db: Session = Depends(get_db), current_user=Depends()):
    gallery = db.get(Gallery, gallery_id)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")
    if gallery.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    gallery.title = data.title
    gallery.description = data.description
    gallery.sort_order = data.sort_order
    if data.album_ids:
        albums = db.query(Album).filter(Album.id.in_(data.album_ids)).all()
        gallery.albums = albums
    db.commit()
    db.refresh(gallery)
    return GalleryRead(
        id=gallery.id,
        title=gallery.title,
        description=gallery.description,
        created_by=gallery.created_by,
        sort_order=gallery.sort_order,
        is_master=gallery.is_master,
        created_at=gallery.created_at,
        updated_at=gallery.updated_at,
        album_ids=[a.id for a in gallery.albums] if hasattr(gallery, "albums") else [],
    )

# =========================
# DELETE GALLERY
# =========================
@router.delete("/{gallery_id}")
def delete_gallery(gallery_id: int, db: Session = Depends(get_db), current_user=Depends()):
    gallery = db.get(Gallery, gallery_id)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admin can delete a gallery")
    db.delete(gallery)
    db.commit()
    return {"detail": "Gallery deleted"}
