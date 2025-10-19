# backend/app/models/library.py

# ======================================
# LIBRARY MODELS
# ======================================

# ======================================
# IMPORTS
# ======================================
import uuid
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.database import Base
from datetime import datetime


# ======================================
# LIBRARY CLASS
# ======================================
class Library(Base):
    __tablename__ = "libraries"
    # LIBRARY MODEL
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, index=True, nullable=False)
    description = Column(String)
    image_url = Column(String, default="", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # RELATIONAL MODEL
    user = relationship("User", back_populates="libraries")
    images = relationship(
        "Image",
        back_populates="library",
        cascade="all, delete-orphan"
    )
