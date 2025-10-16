# backend/app/models/user.py

# ======================================
# USER MODELS
# ======================================

# ======================================
# IMPORTS
# ======================================
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..db.database import Base

# ======================================
# USER CLASS
# ======================================
class User(Base):
    __tablename__ = "users"
    # USER MODEL
    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # RELATIONAL MODEL
    images = relationship(
        "Image", back_populates="user", cascade="all, delete-orphan"
    )
    libraries = relationship(
        "Library", back_populates="user", cascade="all, delete-orphan"
    )