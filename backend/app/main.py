from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import DEBUG

app = FastAPI(title="Insight API", debug=DEBUG)

# Configure CORS so your frontend can call the API
origins = [
    "http://localhost:5173",                 # local frontend
    "https://insight-cish.onrender.com",    # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint — just confirms backend is running
@app.get("/")
def root():
    return {"status": "running", "message": "Backend is up and ready!"}

# Optional: health endpoint
@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is healthy"}
