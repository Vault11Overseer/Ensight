# backend/app/schemas/album.py

from pydantic import BaseModel
from typing import Optional, List
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
    cover_image_s3_key: Optional[str] = None
    cover_image_url: Optional[str] = None  # Computed S3 URL for convenience
    created_at: datetime
    updated_at: datetime
    image_ids: Optional[List[int]] = None  # IDs of images in this album

    class Config:
        from_attributes = True



# =========================
# UPDATE ALBUM
# =========================
class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image_s3_key: Optional[str] = None
