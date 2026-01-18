# backend/app/models/album_images.py

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.db import Base

class AlbumImages(Base):
    __tablename__ = "album_images"

    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="CASCADE"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Ensure the same image cannot be added to the same album twice
    __table_args__ = (UniqueConstraint("album_id", "image_id", name="uq_album_image"),)

    # Optional ORM relationships (requires relationships in Album and Image models)
    album = relationship("Album", back_populates="images")
    image = relationship("Image", back_populates="albums")
