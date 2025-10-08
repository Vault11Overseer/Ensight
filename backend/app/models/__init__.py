# backend/app/models/__init__.py

# SQLAlCHEMY MODEL REPRESENT DATABASE TABLE

# Import all models so they are registered with Base.metadata
from .user import User
from .image import Image
from .library import Library