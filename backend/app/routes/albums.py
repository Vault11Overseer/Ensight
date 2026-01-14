# app/routes/albums.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database.db import get_db
from app.models.album import Album
from app.models.gallery import Gallery

router = APIRouter(prefix="/albums", tags=["Albums"])

class AlbumCreate(BaseModel):
    title: str
    description: str = ""
    gallery_ids: list[int] = []

class AlbumRead(BaseModel):
    id: int
    title: str
    description: str
    created_by: int
    created_at: str
    updated_at: str
    gallery_ids: list[int] = []

    class Config:
        orm_mode = True

@router.get("/", response_model=List[AlbumRead])
def list_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).all()
    return [
        AlbumRead(
            id=a.id,
            title=a.title,
            description=a.description,
            created_by=a.created_by,
            created_at=a.created_at,
            updated_at=a.updated_at,
            gallery_ids=[g.id for g in a.galleries]
        )
        for a in albums
    ]

@router.post("/", response_model=AlbumRead)
def create_album(data: AlbumCreate, db: Session = Depends(get_db), current_user=Depends()):
    album = Album(title=data.title, description=data.description, created_by=current_user.id)
    if data.gallery_ids:
        galleries = db.query(Gallery).filter(Gallery.id.in_(data.gallery_ids)).all()
        album.galleries = galleries
    db.add(album)
    db.commit()
    db.refresh(album)
    return AlbumRead(
        id=album.id,
        title=album.title,
        description=album.description,
        created_by=album.created_by,
        created_at=album.created_at,
        updated_at=album.updated_at,
        gallery_ids=[g.id for g in album.galleries],
    )

@router.put("/{album_id}", response_model=AlbumRead)
def update_album(album_id: int, data: AlbumCreate, db: Session = Depends(get_db), current_user=Depends()):
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    album.title = data.title
    album.description = data.description
    if data.gallery_ids:
        galleries = db.query(Gallery).filter(Gallery.id.in_(data.gallery_ids)).all()
        album.galleries = galleries
    db.commit()
    db.refresh(album)
    return AlbumRead(
        id=album.id,
        title=album.title,
        description=album.description,
        created_by=album.created_by,
        created_at=album.created_at,
        updated_at=album.updated_at,
        gallery_ids=[g.id for g in album.galleries],
    )

@router.delete("/{album_id}")
def delete_album(album_id: int, db: Session = Depends(get_db), current_user=Depends()):
    album = db.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if album.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(album)
    db.commit()
    return {"detail": "Album deleted"}
