# backend/app/routes/favorites.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.image_favorite import ImageFavorite
from app.models.user import User
from app.models.image import Image
from app.schemas.image import ImageRead
from app.auth.dev_auth import get_current_user
from app.routes.images import _format_image_response

router = APIRouter(prefix="/favorites", tags=["Favorites"])


# =========================
# LIST USER'S FAVORITES
# =========================
@router.get("/", response_model=List[ImageRead])
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can view their own favorites.
    """
    favorites = db.query(ImageFavorite).filter(
        ImageFavorite.user_id == current_user.id
    ).all()
    
    images = [fav.image for fav in favorites]
    return [_format_image_response(img, db) for img in images]


# =========================
# ADD IMAGE TO FAVORITES
# =========================
@router.post("/{image_id}")
def add_favorite(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can favorite any image.
    """
    image = db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Check if already favorited
    existing = db.query(ImageFavorite).filter(
        ImageFavorite.user_id == current_user.id,
        ImageFavorite.image_id == image_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Image already in favorites")

    favorite = ImageFavorite(
        user_id=current_user.id,
        image_id=image_id
    )

    db.add(favorite)
    db.commit()
    return {"detail": "Image added to favorites"}


# =========================
# REMOVE IMAGE FROM FAVORITES
# =========================
@router.delete("/{image_id}")
def remove_favorite(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can remove images from their favorites.
    """
    favorite = db.query(ImageFavorite).filter(
        ImageFavorite.user_id == current_user.id,
        ImageFavorite.image_id == image_id
    ).first()

    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(favorite)
    db.commit()
    return {"detail": "Image removed from favorites"}


# =========================
# CHECK IF IMAGE IS FAVORITED
# =========================
@router.get("/{image_id}/check")
def check_favorite(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Check if an image is in the user's favorites.
    """
    favorite = db.query(ImageFavorite).filter(
        ImageFavorite.user_id == current_user.id,
        ImageFavorite.image_id == image_id
    ).first()

    return {"is_favorited": favorite is not None}
