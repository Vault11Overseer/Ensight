# backend/app/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env into environment variables

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"
