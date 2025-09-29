# config.py now only contains settings, pulled from environment variables or defaults.

import os

# -------------------------
# DATABASE SETTINGS
# -------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")

# -------------------------
# JWT / AUTHENTICATION SETTINGS
# -------------------------
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# -------------------------
# FILE UPLOAD SETTINGS
# -------------------------
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"}
MAX_FILE_SIZE_MB = 10

# -------------------------
# APP CONFIG
# -------------------------
DEBUG = os.getenv("DEBUG", "True") == "True"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# LOAD ENVIROMENT
from dotenv import load_dotenv
load_dotenv()


# OPTIONAL: SEPERATE ENVIROMENT

# class Settings:
#     DATABASE_URL: str = DATABASE_URL
#     JWT_SECRET_KEY: str = JWT_SECRET_KEY
#     DEBUG: bool = DEBUG

# from config import DATABASE_URL, JWT_SECRET_KEY, UPLOAD_DIR
