# backend/app/models/gallery.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base

class Gallery(Base):
    __tablename__ = "galleries"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    sort_order = Column(Integer, default=0)
    is_master = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    albums_assoc = relationship(
        "GalleryAlbums",
        back_populates="gallery",
        cascade="all, delete-orphan"
    )
    albums = relationship(
        "Album",
        secondary="gallery_albums",
        back_populates="galleries"
    )

    # Optional: users relationship if you want easy ORM access to the creator
    # user = relationship("User", back_populates="galleries")
