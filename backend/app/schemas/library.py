from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LibraryBase(BaseModel):
    title: str
    description: str
    image_url: str | None = None

class LibraryCreate(LibraryBase):
    title: str
    description: str
    image_base64: Optional[str] = None

class LibraryResponse(LibraryBase):
    id: int
    title: str
    description: str
    image_url: Optional[str] = None
    user_id: int
    created_at: datetime
    #
    user_name: str

    # class Config:
        # orm_mode = True
    class Config:
        from_attributes = True
