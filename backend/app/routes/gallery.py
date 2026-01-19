from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.album import Album

router = APIRouter(prefix="/gallery", tags=["Gallery"])

# =========================
# GET THE GALLERY
# =========================
@router.get("", response_model=dict)
def get_gallery(db: Session = Depends(get_db)):
    """Return the single Gallery album"""
    gallery = db.query(Album).filter(Album.is_master == True).first()
    if not gallery:
        raise HTTPException(status_code=500, detail="Gallery missing")
    return gallery
