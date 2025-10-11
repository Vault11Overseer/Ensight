# app/models/image.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base
from app.models.library import Library
from sqlalchemy.sql import func

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)   # <-- REQUIRED
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(String, nullable=True)  # comma-separated
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    library_id = Column(Integer, ForeignKey("libraries.id"), nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # <-- optional but recommended

    user = relationship("User", back_populates="images")
    library = relationship("Library", back_populates="images")