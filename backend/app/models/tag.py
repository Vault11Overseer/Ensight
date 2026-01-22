# backend/app/models/tag.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    source = Column(String, nullable=False)  # 'user' or 'aws'
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Many-to-many with Images
    images = relationship(
        "Image",
        secondary="image_tags",
        back_populates="tags"
    )
