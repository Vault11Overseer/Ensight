import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
# from .routers.auth_router import router as auth_router
# from .routers.images_router import router as images_router
from .routers import auth_router, images_router
# from .database import init_db
from app.db.database import async_session


app = FastAPI(title="Ensight")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# include routers *after* CORS setup
app.include_router(auth_router, prefix="/auth")
app.include_router(images_router, prefix="/images")

app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Backend is running mate!"}

