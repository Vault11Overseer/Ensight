# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from app.database.db import SessionLocal, engine, Base, get_db
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
# DATABASE DEPENDENCY
# =========================
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# SEED MASTER GALLERY (if not exists)
# =========================
from app.models.gallery import Gallery
from sqlalchemy import select
def seed_master_gallery(db: Session):
    MASTER_GALLERY_ID = 1
    exists = db.execute(select(Gallery).where(Gallery.id == MASTER_GALLERY_ID)).scalar()
    if not exists:
        master = Gallery(
            id=MASTER_GALLERY_ID,
            created_by=None,  # system
            title="Master Gallery",
            description="System-wide gallery containing all images",
        )
        db.add(master)
        db.commit()
        print("✅ Master Gallery created")

# =========================
# ROOT & HEALTH ENDPOINT
# =========================
@app.get("/")
def root(db: Session = Depends(get_db)):
    # Seed Master Gallery if missing
    seed_master_gallery(db)

    db_status = "disconnected"
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except OperationalError:
        db_status = "disconnected"

    return {
        "backend": "running",
        "database": db_status,
        "master_gallery_id": 1
    }

# =========================
# INCLUDE ROUTERS
# =========================
from app.routes.albums import router as albums_router
from app.routes.galleries import router as galleries_router
from app.routes.images import router as images_router
from app.routes.share_links import router as share_links_router
from app.routes.health import router as health_router
from app.routes.users import router as users_router
app.include_router(users_router)

app.include_router(albums_router)
app.include_router(galleries_router)
app.include_router(images_router)
app.include_router(share_links_router)
app.include_router(health_router)
