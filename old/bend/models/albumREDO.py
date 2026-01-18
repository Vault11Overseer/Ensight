# app/models/album.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.db import Base

# Many-to-many association table for galleries ↔ albums
album_gallery_association = Table(
    "gallery_albums",
    Base.metadata,
    Column("album_id", ForeignKey("albums.id"), primary_key=True),
    Column("gallery_id", ForeignKey("galleries.id"), primary_key=True),
)

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    galleries = relationship("Gallery", secondary=album_gallery_association, back_populates="albums")
    images = relationship("Image", secondary="album_images", back_populates="albums")
