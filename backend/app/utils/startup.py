# backend/app/utils/startup.py

from sqlalchemy.orm import Session
from app.database.db import SessionLocal

def ensure_gallery_exists():
    """
    Gallery is now a virtual collection - all images are automatically in the Gallery.
    No need to create a special album for it.
    """
    # Gallery functionality is handled by the /gallery route which returns all images
    pass
