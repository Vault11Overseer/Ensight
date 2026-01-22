# backend/app/models/image.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.mutable import MutableDict
from app.database.db import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    # Ownership
    uploader_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Storage (S3 keys)
    s3_key = Column(String, nullable=False, unique=True)  # Original image location
    preview_key = Column(String, nullable=True)  # Optimized preview image

    # Basic Metadata
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_metadata = Column(MutableDict.as_mutable(JSON), default=dict)  # Full EXIF + misc

    # Camera / Location Data
    camera_make = Column(String, nullable=True)
    camera_model = Column(String, nullable=True)
    lens = Column(String, nullable=True)
    focal_length = Column(String, nullable=True)
    aperture = Column(String, nullable=True)
    shutter_speed = Column(String, nullable=True)
    iso = Column(String, nullable=True)
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    location_name = Column(String, nullable=True)  # Derived or reverse-geocoded

    # Dates
    captured_at = Column(DateTime(timezone=True), nullable=True)  # Date image was taken
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Sharing & Protection
    watermark_enabled = Column(Boolean, default=False, nullable=False)  # Applied at share-time

    # Relationships
    uploader = relationship("User", backref="images")
    
    # Many-to-many with Albums
    albums = relationship(
        "Album",
        secondary="image_albums",
        back_populates="images"
    )
    
    # Many-to-many with Tags
    tags = relationship(
        "Tag",
        secondary="image_tags",
        back_populates="images"
    )
    
    # One-to-many with Share Links (when resource_type is 'image')
    share_links = relationship(
        "ShareLink",
        foreign_keys="ShareLink.resource_id",
        primaryjoin="and_(ShareLink.resource_type == 'image', ShareLink.resource_id == Image.id)",
        viewonly=True
    )
    
    # One-to-many with Favorites
    favorites = relationship(
        "ImageFavorite",
        back_populates="image",
        cascade="all, delete-orphan"
    )
