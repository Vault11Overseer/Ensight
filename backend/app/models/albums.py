# backend/app/models/album.py

from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base
from app.models.album_images import AlbumImages

# Many-to-many association table for galleries ↔ albums
album_gallery_association = Table(
    "album_gallery_association",
    Base.metadata,
    Column("album_id", ForeignKey("albums.id", ondelete="CASCADE"), primary_key=True),
    Column("gallery_id", ForeignKey("galleries.id", ondelete="CASCADE"), primary_key=True),
)

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    galleries = relationship(
        "Gallery",
        secondary=album_gallery_association,
        back_populates="albums"
    )

    # Many-to-many relationship with images
    images = relationship(
        "AlbumImages",
        back_populates="album",
        cascade="all, delete-orphan"
    )

    # Optional: owner relationship
    owner = relationship("User", back_populates="albums")
