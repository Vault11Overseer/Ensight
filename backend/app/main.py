# backend/main.py
from fastapi import FastAPI
from auth import router as auth_router

app = FastAPI(title="Photo Gallery App")

# Mount auth router
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

# This block runs when executing the script
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
