from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.album import Album
from app.models.user import User
from app.auth.dev_auth import get_current_user

router = APIRouter(prefix="/gallery", tags=["Gallery"])

# =========================
# GET THE GALLERY (All authenticated users can view/download)
# =========================
@router.get("", response_model=dict)
def get_gallery(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    All authenticated users can view and download images from the Gallery.
    The Gallery is system-owned and contains all images.
    """
    gallery = db.query(Album).filter(Album.is_master == True).first()
    if not gallery:
        raise HTTPException(status_code=500, detail="Gallery missing")
    return gallery
