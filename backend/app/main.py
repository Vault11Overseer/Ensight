# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

from app.database.db import get_db
from app.models import user, gallery, image, album, image_access, share_link

# =========================
# APP INIT
# =========================
app = FastAPI(title="Insight API", debug=True)

# =========================
# CORS CONFIGURATION
# =========================
origins = [
    "http://localhost:5173",
    "https://insight-cish.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT (NO SIDE EFFECTS)
# =========================
@app.get("/")
def root():
    return {
        "backend": "running",
    }

# =========================
# HEALTH CHECK (DB ONLY)
# =========================
@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except OperationalError:
        return {"database": "disconnected"}

# =========================
# INCLUDE ROUTERS
# =========================
from app.routes.albums import router as albums_router
from app.routes.galleries import router as galleries_router
from app.routes.images import router as images_router
from app.routes.share_links import router as share_links_router
from app.routes.users import router as users_router

app.include_router(users_router)
app.include_router(albums_router)
app.include_router(galleries_router)
app.include_router(images_router)
app.include_router(share_links_router)
