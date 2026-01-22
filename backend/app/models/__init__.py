# backend/app/models/__init__.py

# MODELS
# SQLAlCHEMY - FASTAPI MODELS 
# REPRESENT DATABASE TABLE - DEFINE THE SHAPE OF DATA
# ENABLE INPUT VALIDATION
# PROVIDE AUTOMATIC ERROR HANDLING
# HANDLE DATA SERIALIZATION AND DESERIALIZATION
# IMPROVE TYPE HINTING AND AUTOCOMPLETION
# GENERATE AUTOMATIC API DOCUMENTATION
# ALLOW MODEL REUSABILITY ACROSS ENDPOINTS
# INTEGRATE WITH DATABASE ORM MODELS
# KEEP CODE CLEAN, CONSISTENT, AND MAINTAINABLE

# IMPORT ALL MODELS SO THEY ARE REGISTERED WITH BASE.METADATA
from .user import User
from .album import Album
from .image import Image
from .tag import Tag
from .image_album import image_albums
from .image_tag import image_tags
from .image_favorite import ImageFavorite
from .share_link import ShareLink

# Conceptually:

# class Library(Base):
#     id
#     name
#     description


# This becomes:

# CREATE TABLE library (
#   id SERIAL PRIMARY KEY,
#   name TEXT,
#   description TEXT
# );