# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from app.database.db import get_db

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
# ROOT & HEALTH ENDPOINT
# =========================
@app.get("/")
def root(db: Session = Depends(get_db)):
    db_status = "disconnected"
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except OperationalError:
        pass

    return {
        "backend": "running",
        "database": db_status,
    }

# =========================
# INCLUDE ROUTERS
# =========================
# from app.routes.albums import router as albums_router
# from app.routes.galleries import router as galleries_router
# from app.routes.images import router as images_router
# from app.routes.share_links import router as share_links_router
from app.routes.health import router as health_router
from app.routes.users import router as users_router
from app.auth import dev_auth


app.include_router(dev_auth.router)
app.include_router(users_router)
# app.include_router(albums_router)
# app.include_router(galleries_router)
# app.include_router(images_router)
# app.include_router(share_links_router)
app.include_router(health_router)
