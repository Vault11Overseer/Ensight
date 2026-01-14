# backend/app/models/share_link.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base

class ShareLink(Base):
    __tablename__ = "share_links"

    id = Column(Integer, primary_key=True, index=True)
    object_type = Column(String, nullable=False)  # 'image', 'album', 'gallery'
    object_id = Column(Integer, nullable=False)   # the id of the object being shared
    token = Column(String, unique=True, nullable=False)  # unique share token
    expires_at = Column(DateTime, nullable=True)         # optional expiration
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)  # who created the share link
    is_active = Column(Boolean, default=True)           # can be deactivated without deleting
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to user
    user = relationship("User", back_populates="share_links")
