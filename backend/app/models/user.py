# backend/app/models/user.py

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, default="user")  # 'user' or 'admin'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    galleries = relationship("Gallery", back_populates="owner", cascade="all, delete-orphan")
    albums = relationship("Album", back_populates="owner", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="owner", cascade="all, delete-orphan")
    share_links = relationship("ShareLink", back_populates="user", cascade="all, delete-orphan")
