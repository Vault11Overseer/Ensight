# backend/app/schemas/share_link.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =========================
# CREATE SHARE LINK
# =========================
class ShareLinkCreate(BaseModel):
    resource_type: str  # 'album' or 'image'
    resource_id: int
    expires_at: Optional[datetime] = None


# =========================
# READ SHARE LINK
# =========================
class ShareLinkRead(BaseModel):
    id: int
    resource_type: str
    resource_id: int
    owner_user_id: int
    token: str
    link: str
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =========================
# UPDATE SHARE LINK
# =========================
class ShareLinkUpdate(BaseModel):
    expires_at: Optional[datetime] = None
