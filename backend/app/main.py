from fastapi import FastAPI

app = FastAPI(title="Insight API")

@app.get("/")
def health_check():
    return {"status": "ok"}
