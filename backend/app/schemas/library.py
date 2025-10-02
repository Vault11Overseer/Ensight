# app/schemas/library.py
from pydantic import BaseModel
from typing import Optional

class LibraryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    model_config = {"from_attributes": True}  # for Pydantic v2
