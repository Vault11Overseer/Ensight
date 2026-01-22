# backend/app/models/share_link.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base
import enum


class ResourceType(str, enum.Enum):
    ALBUM = "album"
    IMAGE = "image"


class ShareLink(Base):
    __tablename__ = "share_links"

    id = Column(Integer, primary_key=True, index=True)
    
    # Resource reference
    resource_type = Column(
        SQLEnum(ResourceType),
        nullable=False
    )
    resource_id = Column(Integer, nullable=False, index=True)  # FK to albums.id or images.id
    
    # Ownership
    owner_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Link details
    token = Column(String, unique=True, nullable=False, index=True)  # Unique, unguessable token
    link = Column(String, nullable=False)  # Full URL
    
    # Expiration
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
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

    # Relationships
    owner = relationship("User", backref="share_links")
    
    # Optional relationship to Image (if resource_type is 'image')
    # Note: This is a viewonly relationship since resource_id can point to either Image or Album
