# backend/app/schemas/tag.py

from pydantic import BaseModel
from datetime import datetime


# =========================
# READ TAG
# =========================
class TagRead(BaseModel):
    id: int
    name: str
    source: str  # 'user' or 'aws'
    created_at: datetime

    class Config:
        from_attributes = True
