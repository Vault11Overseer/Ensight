from fastapi import APIRouter, Depends, UploadFile, File
from .s3_utils import upload_file_to_s3
from .auth_router import get_current_user

router = APIRouter(prefix="/images", tags=["images"])

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    url = upload_file_to_s3(file, user_id=str(current_user["id"]))
    return {"url": url}
