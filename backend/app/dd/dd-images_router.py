from fastapi import APIRouter, Depends, UploadFile, HTTPException, File
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse
import os
from pathlib import Path
from .database import get_db
from .services.s3_utils import upload_file_to_s3
from .auth_router import get_current_user
# from app import s3_utils



UPLOAD_DIR = Path("uploads/images_router")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# router = APIRouter(prefix="/images_router", tags=["images"])
router = APIRouter()

@router.get("/example")
async def example():
    return {"msg": "hello"}



@router.post("/upload")
async def upload_image(file: UploadFile, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    file_url = upload_file_to_s3(file, user_id)
    return {"url": file_url}
    # try:
    #     file_path = UPLOAD_DIR / file.filename
    #     with open(file_path, "wb") as buffer:
    #         buffer.write(await file.read())

    #     return {"filename": file.filename, "url": f"/static/images/{file.filename}"}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    
