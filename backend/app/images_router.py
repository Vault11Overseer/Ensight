from fastapi import APIRouter, Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db
from .s3_utils import upload_file_to_s3
from .auth_router import get_current_user

router = APIRouter()

@router.get("/example")
async def example():
    return {"msg": "hello"}

@router.post("/upload")
async def upload_image(
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        url = upload_file_to_s3(file, str(current_user["id"]))
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
