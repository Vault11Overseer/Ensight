# backend/app/schemas/library.py

# ======================================
# LIBRARY SCHEMA
# ======================================

# ======================================
# IMPORTS
# ======================================
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# ======================================
# LIBRARY BASE - BASE MODEL
# ======================================
class LibraryBase(BaseModel):
    title: str
    description: str
    image_url: str | None = None

# ======================================
# LIBRARY CREATE - LIBRARY BASE
# ======================================
class LibraryCreate(LibraryBase):
    title: str
    description: str
    image_base64: Optional[str] = None

# ======================================
# LIBRARY RESPONSE - LIBRARY BASE
# ======================================
class LibraryResponse(LibraryBase):
    id: int
    title: str
    description: str
    image_url: Optional[str] = None
    user_id: int
    created_at: datetime
    
    user_name: str
    class Config:
        from_attributes = True
# WENT ABOVE