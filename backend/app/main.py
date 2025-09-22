from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth_router import router as auth_router
from .image_router import router as image_router
from .database import init_db
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Ensight")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(image_router)

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
