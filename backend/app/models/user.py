# backend/app/models/user.py

from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.db import Base
from sqlalchemy.ext.mutable import MutableDict



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # Auth / identity
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    # Cognito-ready
    cognito_sub = Column(String, unique=True, nullable=True)
    # Profile
    avatar = Column(String, nullable=True)  # S3 URL/path to avatar image
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # 'admin' or 'user'
    # Dev-only (remove later)
    password_hash = Column(String, nullable=True)
    profile_metadata = Column(MutableDict.as_mutable(JSON), default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


    # =========================
    # Relationships
    # =========================
    # Albums: One-to-many relationship
    # Note: The relationship is defined via backref in Album model
    # Access via: user.albums (returns list of Album objects)
    
    # Images: One-to-many relationship (when Image model is created)
    # images = relationship(
    #     "Image",
    #     foreign_keys="Image.owner_user_id",
    #     back_populates="owner",
    #     cascade="all, delete-orphan"
    # )
    
    # Share Links: One-to-many relationship (when ShareLink model is created)
    # share_links = relationship(
    #     "ShareLink",
    #     foreign_keys="ShareLink.user_id",
    #     back_populates="user",
    #     cascade="all, delete-orphan"
    # )
    
    # Image Favorites: One-to-many relationship (when ImageFavorite model is created)
    # image_favorites = relationship(
    #     "ImageFavorite",
    #     foreign_keys="ImageFavorite.user_id",
    #     back_populates="user",
    #     cascade="all, delete-orphan"
    # )
