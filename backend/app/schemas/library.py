from pydantic import BaseModel
from datetime import datetime

class LibraryBase(BaseModel):
    title: str
    description: str
    image_url: str | None = None

class LibraryCreate(LibraryBase):
    pass

class LibraryResponse(LibraryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
