# backend/app/schemas/album.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =========================
# CREATE ALBUM
# =========================
class AlbumCreate(BaseModel):
    title: str
    description: Optional[str] = None


# =========================
# READ ALBUM
# =========================
class AlbumRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_user_id: int
    is_master: bool
    share_link: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        # orm_mode = True
        from_attributes = True



# =========================
# UPDATE ALBUM
# =========================
class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
