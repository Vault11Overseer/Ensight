# backend/app/routes/share_links.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
import secrets

from app.database.db import get_db
from app.models.share_link import ShareLink, ResourceType
from app.models.user import User
from app.models.image import Image
from app.models.album import Album
from app.schemas.share_link import ShareLinkCreate, ShareLinkRead, ShareLinkUpdate
from app.auth.dev_auth import get_current_user

router = APIRouter(prefix="/share-links", tags=["Share Links"])


# =========================
# LIST SHARE LINKS (Users can list their own, admins can list all)
# =========================
@router.get("/", response_model=List[ShareLinkRead])
def list_share_links(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can list their own share links.
    Admins can list all share links.
    """
    if current_user.role == "admin":
        links = db.query(ShareLink).all()
    else:
        links = db.query(ShareLink).filter(ShareLink.owner_user_id == current_user.id).all()
    
    return links


# =========================
# CREATE SHARE LINK
# =========================
@router.post("/", response_model=ShareLinkRead)
def create_share_link(
    data: ShareLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can create share links for their own resources.
    Admins can create share links for any resource.
    """
    # Validate resource exists and user has permission
    if data.resource_type == "image":
        resource = db.get(Image, data.resource_id)
        if not resource:
            raise HTTPException(status_code=404, detail="Image not found")
        if current_user.role != "admin" and resource.uploader_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    elif data.resource_type == "album":
        resource = db.get(Album, data.resource_id)
        if not resource:
            raise HTTPException(status_code=404, detail="Album not found")
        if current_user.role != "admin" and resource.owner_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    else:
        raise HTTPException(status_code=400, detail="Invalid resource_type")

    # Generate unique token
    token = secrets.token_urlsafe(32)
    
    # Generate link (you'll need to set your frontend URL)
    frontend_url = "http://localhost:5173"  # TODO: Get from config
    link = f"{frontend_url}/share/{token}"

    share_link = ShareLink(
        resource_type=ResourceType(data.resource_type),
        resource_id=data.resource_id,
        owner_user_id=current_user.id,
        token=token,
        link=link,
        expires_at=data.expires_at,
    )

    db.add(share_link)
    db.commit()
    db.refresh(share_link)
    return share_link


# =========================
# GET SHARE LINK BY TOKEN (Public for sharing)
# =========================
@router.get("/token/{token}", response_model=ShareLinkRead)
def get_share_link_by_token(
    token: str,
    db: Session = Depends(get_db),
):
    """
    Public endpoint to get share link details by token.
    Used when someone accesses a shared link.
    """
    share_link = db.query(ShareLink).filter(ShareLink.token == token).first()
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    # Check if expired
    if share_link.expires_at:
        from datetime import datetime, timezone
        if datetime.now(timezone.utc) > share_link.expires_at:
            raise HTTPException(status_code=410, detail="Share link has expired")

    return share_link


# =========================
# GET SINGLE SHARE LINK
# =========================
@router.get("/{link_id}", response_model=ShareLinkRead)
def get_share_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can view their own share links.
    Admins can view any share link.
    """
    share_link = db.get(ShareLink, link_id)
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    if current_user.role != "admin" and share_link.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return share_link


# =========================
# UPDATE SHARE LINK
# =========================
@router.put("/{link_id}", response_model=ShareLinkRead)
def update_share_link(
    link_id: int,
    data: ShareLinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can update their own share links.
    Admins can update any share link.
    """
    share_link = db.get(ShareLink, link_id)
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    if current_user.role != "admin" and share_link.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if data.expires_at is not None:
        share_link.expires_at = data.expires_at

    db.commit()
    db.refresh(share_link)
    return share_link


# =========================
# DELETE SHARE LINK (Revoke)
# =========================
@router.delete("/{link_id}")
def delete_share_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Users can delete (revoke) their own share links.
    Admins can delete any share link.
    """
    share_link = db.get(ShareLink, link_id)
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    if current_user.role != "admin" and share_link.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(share_link)
    db.commit()
    return {"detail": "Share link revoked"}
