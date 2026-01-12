from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db import engine, SessionLocal, Base
from .models import Library

app = FastAPI(title="Insight API")

# CORS configuration
origins = [
    "https://insight-cish.onrender.com",  # frontend URL
    "http://localhost:5173",              # local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if they don’t exist
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check
@app.get("/")
def health_check():
    return {"status": "ok"}

# Create library entry
@app.post("/library")
def create_library(name: str, description: str = "", db: Session = Depends(get_db)):
    lib = Library(name=name, description=description)
    db.add(lib)
    db.commit()
    db.refresh(lib)
    return lib

# Get all library entries
@app.get("/library")
def get_library(db: Session = Depends(get_db)):
    return db.query(Library).all()
