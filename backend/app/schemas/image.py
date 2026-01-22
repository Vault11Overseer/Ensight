# backend/app/schemas/image.py

from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime


# =========================
# CREATE IMAGE
# =========================
class ImageCreate(BaseModel):
    title: str
    description: Optional[str] = None
    album_ids: Optional[List[int]] = None  # Albums to associate with at upload
    user_tags: Optional[List[str]] = None  # User-defined tags
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[str] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    location_name: Optional[str] = None
    captured_at: Optional[datetime] = None
    image_metadata: Optional[Dict] = None


# =========================
# READ IMAGE
# =========================
class ImageRead(BaseModel):
    id: int
    uploader_user_id: int
    s3_key: str
    s3_url: str  # Full URL to the image
    preview_key: Optional[str]
    preview_url: Optional[str]  # Full URL to the preview image
    title: str
    description: Optional[str]
    image_metadata: Optional[Dict]
    camera_make: Optional[str]
    camera_model: Optional[str]
    lens: Optional[str]
    focal_length: Optional[str]
    aperture: Optional[str]
    shutter_speed: Optional[str]
    iso: Optional[str]
    gps_latitude: Optional[float]
    gps_longitude: Optional[float]
    location_name: Optional[str]
    captured_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    watermark_enabled: bool
    album_ids: Optional[List[int]] = None
    tag_names: Optional[List[str]] = None  # Combined user_tags and aws_tags

    class Config:
        from_attributes = True


# =========================
# UPDATE IMAGE
# =========================
class ImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[str] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    location_name: Optional[str] = None
    captured_at: Optional[datetime] = None
    image_metadata: Optional[Dict] = None
    watermark_enabled: Optional[bool] = None
