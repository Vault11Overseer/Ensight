# backend/app/models/image_favorite.py

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base


class ImageFavorite(Base):
    __tablename__ = "image_favorites"

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )
    image_id = Column(
        Integer,
        ForeignKey("images.id", ondelete="CASCADE"),
        primary_key=True
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user = relationship("User", backref="image_favorites")
    image = relationship("Image", back_populates="favorites")

    # Ensure one favorite per user-image pair
    __table_args__ = (
        UniqueConstraint("user_id", "image_id", name="unique_user_image_favorite"),
    )
