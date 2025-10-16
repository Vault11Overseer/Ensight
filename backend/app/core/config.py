# app/core/config.py

# ======================================
# CONFIGURATION FOR THE BACKEND
# ======================================

# ======================================
# IMPORTS
# ======================================
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
# from pydantic import BaseSettings

# ======================================
# LOAD ENVIRONMENT
# ======================================
load_dotenv()

class Settings(BaseSettings):
    
    # ======================================
    # DATABASE
    # ======================================
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # ======================================
    # JWT / AUTH
    # ======================================
    JWT_SECRET_KEY: str = "supersecretkey"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 1 day

    # ======================================
    # CORS
    # ======================================
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    # ======================================
    # FILE UPLOADS
    # ======================================
    UPLOAD_DIR: str = "./defaultImages"
    ALLOWED_EXTENSIONS: set[str] = {"jpg", "jpeg", "png", "gif"}
    MAX_FILE_SIZE_MB: int = 10

    # ======================================
    # APP CONFIG
    # ======================================
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

# ======================================
# INSTANTIATE
# ======================================
settings = Settings()

# ======================================
# LEGACY EXPORTS FOR OLD IMPORTS
# ======================================
DATABASE_URL = settings.DATABASE_URL
JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
UPLOAD_DIR = settings.UPLOAD_DIR
ALLOWED_EXTENSIONS = settings.ALLOWED_EXTENSIONS
MAX_FILE_SIZE_MB = settings.MAX_FILE_SIZE_MB
DEBUG = settings.DEBUG
FRONTEND_URL = settings.FRONTEND_URL
