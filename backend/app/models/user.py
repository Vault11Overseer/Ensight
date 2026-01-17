# backend/app/models/user.py

from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.db import Base
from sqlalchemy.ext.mutable import MutableDict



class User(Base):
    __tablename__ = "users"

    # =========================
    # Core user fields
    # =========================
    id = Column(Integer, primary_key=True, index=True)          # user_id
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)             # hashed password
    role = Column(String, default="user")   
    profile_metadata = Column(MutableDict.as_mutable(JSON), default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


    # =========================
    # Relationships
    # =========================
    # galleries = relationship(
    #     "Gallery",
    #     back_populates="owner",
    #     cascade="all, delete-orphan"
    # )
    # albums = relationship(
    #     "Album",
    #     back_populates="owner",
    #     cascade="all, delete-orphan"
    # )
    # images = relationship(
    #     "Image",
    #     back_populates="owner",
    #     cascade="all, delete-orphan"
    # )
    # share_links = relationship(
    #     "ShareLink",
    #     back_populates="user",
    #     cascade="all, delete-orphan"
    # )
