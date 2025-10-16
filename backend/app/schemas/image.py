# app/schemas/image.py

# ======================================
# IMAGE SCHEMA
# ======================================

# ======================================
# IMPORTS
# ======================================
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ======================================
# IMAGE CREATE - BASE MODEL
# ======================================
class ImageCreate(BaseModel):
    title: str
    description: Optional[str]
    library_id: Optional[int]
    tags: Optional[List[str]] = []

# ======================================
# IMAGE OUT - BASE MODEL
# ======================================
class ImageOut(BaseModel):
    id: int
    url: str
    title: str
    description: Optional[str]
    tags: List[str]
    user_id: int
    library_id: Optional[int]
    created_at: datetime
    
    # FOR THE FRONTEND DISPLAY
    user_name: Optional[str] = None
    library_title: Optional[str] = None

    class Config:
        from_attributes = True
