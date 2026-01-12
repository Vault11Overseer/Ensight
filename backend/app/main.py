from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Insight API")

# Add this CORS configuration
origins = [
    "https://insight-cish.onrender.com",  # frontend Render URL
    "http://localhost:5173",              # optional, local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allows these domains
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],         # allow all headers
)

@app.get("/")
def health_check():
    return {"status": "ok"}
