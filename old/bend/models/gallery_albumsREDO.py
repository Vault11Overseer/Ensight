# backend/app/models/gallery_album.py

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base

class GalleryAlbums(Base):
    __tablename__ = "gallery_albums"

    id = Column(Integer, primary_key=True, index=True)
    gallery_id = Column(Integer, ForeignKey("galleries.id", ondelete="CASCADE"), nullable=False)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships (optional but helpful for ORM queries)
    gallery = relationship("Gallery", back_populates="albums_assoc")
    album = relationship("Album", back_populates="galleries_assoc")

    __table_args__ = (
        UniqueConstraint("gallery_id", "album_id", name="uq_gallery_album"),
    )
