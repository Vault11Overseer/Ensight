from sqlalchemy import Column, Integer, String
from .db import Base

class Library(Base):
    __tablename__ = "library"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
