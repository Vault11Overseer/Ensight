# app/schemas/image.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ImageCreate(BaseModel):
    title: str
    description: Optional[str]
    library_id: Optional[int]
    tags: Optional[List[str]] = []

class ImageOut(BaseModel):
    id: int
    url: str
    title: str
    description: Optional[str]
    tags: List[str]
    user_id: int
    library_id: Optional[int]
    created_at: datetime
    
    # These are for the frontend display
    user_name: Optional[str] = None
    library_title: Optional[str] = None

    class Config:
        from_attributes = True
