# backend/app/auth/s3.py

# ======================================
# IMPORTS
# ======================================
import os
import base64
from uuid import uuid4
from typing import Optional
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError, ClientError
from app.auth.aws import get_s3_client, get_rekognition_client



# ======================================
# S3 CONFIGURATION (Lazy loading)
# ======================================
def _get_aws_config():
    """Get AWS configuration, raising error if not set"""
    aws_region = os.getenv("AWS_REGION")
    bucket = os.getenv("AWS_BUCKET_NAME")
    
    if not bucket:
        raise ValueError("AWS_BUCKET_NAME environment variable is not set. Add it to your .env file.")
    
    if not aws_region:
        raise ValueError("AWS_REGION environment variable is not set. Add it to your .env file.")
    
    return aws_region, bucket


def _get_s3_base_url():
    """Get S3 base URL, validating config first"""
    aws_region, bucket = _get_aws_config()
    return f"https://{bucket}.s3.{aws_region}.amazonaws.com"


# ======================================
# HELPER FUNCTIONS
# ======================================
def get_s3_url(s3_key: str) -> str:
    """Get the full S3 URL from an S3 key"""
    base_url = _get_s3_base_url()
    return f"{base_url}/{s3_key}"


# ======================================
# FILE UPLOAD
# ======================================
def upload_file_to_s3(
    file: UploadFile,
    user_id: int,
    folder: Optional[str] = None
) -> tuple[str, str]:
    """
    Upload a file to S3. Returns (s3_key, s3_url).
    User files: folder=None -> uploads/{user_id}/
    Default images: folder="defaultImages/"
    """
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    prefix = folder or f"uploads/{user_id}/"
    if not prefix.endswith("/"):
        prefix += "/"

    file_key = f"{prefix}{uuid4()}.{file_extension}"
    content_type = getattr(file, "content_type", None) or "application/octet-stream"
    
    _, bucket = _get_aws_config()

    try:
        get_s3_client().upload_fileobj(
            file.file,
            bucket,
            file_key,
            ExtraArgs={"ContentType": content_type}
        )
    except Exception as e:
        raise Exception(f"S3 upload failed: {e}")

    s3_url = get_s3_url(file_key)
    return file_key, s3_url



# ======================================
# BASE64 UPLOAD
# ======================================
def upload_base64_to_s3(base64_str: str, folder: str = "defaultImages/") -> tuple[str, str]:
    """
    Upload Base64 image to S3. Returns public URL.
    Default folder is defaultImages/
    """
    if "," in base64_str:
        _, data_str = base64_str.split(",", 1)
    else:
        data_str = base64_str

    try:
        image_bytes = base64.b64decode(data_str)
    except Exception:
        raise ValueError("Invalid Base64 string")

    file_name = f"{uuid4()}.png"
    key = f"{folder}{file_name}"
    
    _, bucket = _get_aws_config()

    try:
        get_s3_client().put_object(
            Bucket=bucket,
            Key=key,
            Body=image_bytes,
            ContentType="image/png",
        )
    except NoCredentialsError:
        raise Exception("AWS credentials not found")

    s3_url = get_s3_url(key)
    return key, s3_url




# ======================================
# REKOGNITION LABEL DETECTION
# ======================================
def rekognition_detect_labels(s3_key: str, max_labels: int = 10, min_confidence: float = 80.0):
    """
    Detects labels in an image stored on S3.
    s3_key: The S3 key (path) of the image, e.g., "uploads/123/image.jpg"
    Returns: list of label names
    """
    _, bucket = _get_aws_config()
    
    try:
        response = get_rekognition_client().detect_labels(
            Image={"S3Object": {"Bucket": bucket, "Name": s3_key}},
            MaxLabels=max_labels,
            MinConfidence=min_confidence,
        )

        labels = [label["Name"] for label in response["Labels"]]
        return labels

    except Exception as e:
        raise Exception(f"Rekognition label detection failed: {e}")



# ======================================
# DELETE S3 OBJECT
# ======================================
def delete_s3_object(s3_key: str):
    """Delete a file from the AWS S3 bucket based on its key."""
    if not s3_key:
        return
    _, bucket = _get_aws_config()
    try:
        get_s3_client().delete_object(Bucket=bucket, Key=s3_key)
    except ClientError as e:
        print(f"❌ Error deleting S3 object: {e}")