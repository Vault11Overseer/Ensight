# backend/app/models/user.py

# ======================================
# USER MODELS
# ======================================

# ======================================
# IMPORTS
# ======================================
import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from ..db.database import Base
from sqlalchemy.orm import relationship

# ======================================
# USER CLASS
# ======================================
class User(Base):
    __tablename__ = "users"
    # USER MODEL
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # RELATIONAL MODEL
    images = relationship(
        "Image", back_populates="user", cascade="all, delete-orphan"
    )
    libraries = relationship(
        "Library", back_populates="user", cascade="all, delete-orphan"
    )