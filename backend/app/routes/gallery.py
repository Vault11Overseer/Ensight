# backend/app/routes/gallery.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db
from app.models.image import Image
from app.models.user import User
from app.schemas.image import ImageRead
from app.auth.dev_auth import get_current_user
from app.routes.images import _format_images_response

router = APIRouter(prefix="/gallery", tags=["Gallery"])

# =========================
# GET THE GALLERY (All authenticated users can view/download)
# =========================
@router.get("", response_model=List[ImageRead])
def get_gallery(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
):
    """
    All authenticated users can view and download images from the Gallery.
    The Gallery contains all images uploaded by any user.
    Supports search by tags, title, description.
    """
    query = db.query(Image)
    
    # Search functionality
    if search:
        search_term = f"%{search.lower()}%"
        from app.models.tag import Tag
        from app.models.image_tag import image_tags
        
        # Search in title, description, or tags
        query = query.filter(
            (Image.title.ilike(search_term)) |
            (Image.description.ilike(search_term)) |
            (Image.id.in_(
                db.query(image_tags.c.image_id).join(Tag).filter(
                    Tag.name.ilike(search_term)
                )
            ))
        )
    
    images = query.order_by(Image.created_at.desc()).offset(skip).limit(limit).all()
    return _format_images_response(images, db)
