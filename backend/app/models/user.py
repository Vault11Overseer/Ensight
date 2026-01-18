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
    cognito_sub = Column(String, unique=True, nullable=True)  # <-- ADD THIS
    # Profile
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="user")
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
