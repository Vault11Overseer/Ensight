from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from sqlalchemy.sql import func
# from app.models import Base
from app.db.database import Base



class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    # name = Column(String, nullable=False)          # <-- this must exist
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    s3_key = Column(String, nullable=False)
    url = Column(String, nullable=False)
    thumb_url = Column(String, nullable=True)
    filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


owner = relationship("User", backref="images")


# simple many-to-many for galleries (left for future)