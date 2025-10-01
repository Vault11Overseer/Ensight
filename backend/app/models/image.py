# app/models/image.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base  # use the Base from database.py

class Image(Base):
    __tablename__ = "images"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # relationship
    owner = relationship("User", backref="images")
