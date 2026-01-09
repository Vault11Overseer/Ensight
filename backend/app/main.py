from fastapi import FastAPI

app = FastAPI(title="Ensight API")

@app.get("/")
def health_check():
    return {"status": "ok"}
