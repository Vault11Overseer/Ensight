# backend/app/routes/share_links.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from typing import List
from pydantic import BaseModel
from app.database.db import get_db
from app.models.share_link import ShareLink
from app.models.image import Image
from app.models.album import Album
from app.models.gallery import Gallery

router = APIRouter(prefix="/share-links", tags=["Share Links"])

# =========================
# Pydantic Schemas
# =========================
class ShareLinkCreate(BaseModel):
    object_type: str  # 'image', 'album', 'gallery'
    object_id: int
    expires_at: datetime | None = None

class ShareLinkRead(BaseModel):
    id: int
    object_type: str
    object_id: int
    token: str
    expires_at: datetime | None
    created_at: datetime

    class Config:
        orm_mode = True

# =========================
# CREATE SHARE LINK
# =========================
@router.post("/", response_model=ShareLinkRead)
def create_share_link(data: ShareLinkCreate, db: Session = Depends(get_db), current_user=Depends()):
    # Check if object exists and if user has permission
    obj = None
    if data.object_type == "image":
        obj = db.get(Image, data.object_id)
    elif data.object_type == "album":
        obj = db.get(Album, data.object_id)
    elif data.object_type == "gallery":
        obj = db.get(Gallery, data.object_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid object type")

    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")

    # Permission: only owner or admin can generate share link
    owner_id = getattr(obj, "user_id", getattr(obj, "created_by", None))
    if owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Generate token
    token = str(uuid.uuid4())
    link = ShareLink(
        object_type=data.object_type,
        object_id=data.object_id,
        token=token,
        expires_at=data.expires_at
    )
    db.add(link)
    db.commit()
    db.refresh(link)

    return link

# =========================
# LIST SHARE LINKS
# =========================
@router.get("/", response_model=List[ShareLinkRead])
def list_share_links(db: Session = Depends(get_db), current_user=Depends()):
    # Users can see their own share links; admin sees all
    if current_user.is_admin:
        links = db.query(ShareLink).all()
    else:
        # Only links for objects owned by current_user
        links = []
        for obj_type in ["image", "album", "gallery"]:
            model = {"image": Image, "album": Album, "gallery": Gallery}[obj_type]
            user_objects = db.query(model).filter(
                getattr(model, "user_id", getattr(model, "created_by", None)) == current_user.id
            ).all()
            for obj in user_objects:
                obj_links = db.query(ShareLink).filter(
                    ShareLink.object_type == obj_type,
                    ShareLink.object_id == obj.id
                ).all()
                links.extend(obj_links)
    return links

# =========================
# GET SHARE LINK BY TOKEN
# =========================
@router.get("/token/{token}", response_model=ShareLinkRead)
def get_share_link(token: str, db: Session = Depends(get_db)):
    link = db.query(ShareLink).filter_by(token=token).first()
    if not link:
        raise HTTPException(status_code=404, detail="Share link not found")
    # Optional: check expiration
    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Share link expired")
    return link

# =========================
# DELETE SHARE LINK
# =========================
@router.delete("/{link_id}")
def delete_share_link(link_id: int, db: Session = Depends(get_db), current_user=Depends()):
    link = db.get(ShareLink, link_id)
    if not link:
        raise HTTPException(status_code=404, detail="Share link not found")

    # Only owner or admin can delete
    obj_type = link.object_type
    model = {"image": Image, "album": Album, "gallery": Gallery}[obj_type]
    obj = db.get(model, link.object_id)
    owner_id = getattr(obj, "user_id", getattr(obj, "created_by", None))
    if owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(link)
    db.commit()
    return {"detail": "Share link deleted"}
