# backend/app/main.py


# ======================================
# MAIN 
# ======================================

# ======================================
# IMPORTS
# ======================================
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path
from app.routers import auth_router, library_router, images_router
from app.db.database import init_db


# ======================================
# BASE DIRECTORY
# ======================================
BASE_DIR = Path(__file__).resolve().parent.parent

# ======================================
# LIFESPAN CONTEXT
# ======================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # INITIALIZE DATABASE
    print("Database initialized!")
    yield
    print("Shutting down...")

# INITIALIZE FASTAPI
app = FastAPI(title="Ensight", lifespan=lifespan)

# ======================================
# CORS
# ======================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://bcimedia.com",
    "https://www.bcimedia.com",
    "https://bcimedia.com/ensight",
    "https://www.bcimedia.com/ensight",
]

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================
# ROUTERS AND STATIC FILES
# ======================================
app.include_router(auth_router.router)
app.include_router(library_router.router)
app.include_router(images_router.router, prefix="/images", tags=["images"])
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# ======================================
# SET ROUTE
# ======================================
@app.get("/")
async def root():
    return {"message": "Backend is running!"}

# ======================================
# RUN SERVER
# ======================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
