# app/models/image.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    library_id = Column(Integer, ForeignKey("libraries.id"), nullable=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(String)  # store tags as comma-separated for now
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="images")
    library = relationship("Library", back_populates="images")
