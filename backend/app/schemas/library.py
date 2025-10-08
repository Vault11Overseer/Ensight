from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LibraryBase(BaseModel):
    title: str
    description: str
    image_url: str | None = None

class LibraryCreate(LibraryBase):
    image_base64: Optional[str] = None

class LibraryResponse(LibraryBase):
    id: int
    user_id: int
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
