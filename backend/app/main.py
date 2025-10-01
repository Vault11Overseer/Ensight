import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers.auth_router import router as auth_router
from .routers.images_router import router as images_router
from contextlib import asynccontextmanager
from app.db.database import init_db  # make sure this import is correct


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up...")
    await init_db()  # run your DB init here
    yield
    # Shutdown logic
    print("Shutting down...")


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

@app.get("/")
async def root():
    return {"message": "Backend is running mate!"}


# backend/app/run.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
