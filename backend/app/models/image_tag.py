# backend/app/models/image_tag.py

from sqlalchemy import Column, Integer, ForeignKey, Table
from app.database.db import Base

# Join table for many-to-many relationship between Images and Tags
image_tags = Table(
    "image_tags",
    Base.metadata,
    Column("image_id", Integer, ForeignKey("images.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
