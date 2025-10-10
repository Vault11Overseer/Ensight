import os
import asyncio
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, library_router, images_router
from contextlib import asynccontextmanager
from app.db.database import init_db, Base, engine
from pathlib import Path

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await init_db()
    print("Database initialized!")
    yield
    # Shutdown logic (optional)
    print("Shutting down...")
    

app = FastAPI(title="Ensight", lifespan=lifespan)

# Run database initialization on startup
@app.on_event("startup")
async def on_startup():
    await init_db()

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(library_router.router)
app.include_router(images_router.router)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")


@app.get("/")
async def root():
    return {"message": "Backend is running mate!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
