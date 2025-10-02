# app/models/image.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
from app.models.library import Library

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, nullable=False)
    title = Column(String)
    description = Column(String)
    tags = Column(String)
    is_public = Column(Boolean, default=True)
    library_id = Column(Integer, ForeignKey("libraries.id"), nullable=True)

    user = relationship("User", back_populates="images")
    library = relationship("Library", back_populates="images")