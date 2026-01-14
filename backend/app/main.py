from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import DEBUG
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from app.database.db import SessionLocal
from app.routes.health import router as health_router

app = FastAPI(title="Insight API", debug=DEBUG)

# Configure CORS so your frontend can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://insight-cish.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint — just confirms backend is running
@app.get("/")
def root():
    return {"backend": "running"}

# Health = backend + DB
app.include_router(health_router)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    db_status = "disconnected"
    try:
        # Test query to check DB connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except OperationalError:
        db_status = "disconnected"

    return {"status": "ok", "db": db_status}