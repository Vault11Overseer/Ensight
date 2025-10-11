# app/services/s3_utils.py
import os, base64
from uuid import uuid4
from typing import Optional
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError
from app.core.aws import s3_client  # import shared client
from app.core.config import settings
# --- AWS Rekognition helper ---
from app.core.aws import rekognition_client


AWS_REGION = os.getenv("AWS_REGION")
BUCKET = os.getenv("AWS_BUCKET_NAME")

if not BUCKET:
    raise ValueError("AWS_BUCKET_NAME environment variable is not set.")

S3_BASE_URL = f"https://{BUCKET}.s3.{AWS_REGION}.amazonaws.com"


def upload_file_to_s3(
    file: UploadFile,
    user_id: str,
    folder: Optional[str] = None
) -> str:
    """
    Upload a file to S3. Returns public URL.
    User files: folder=None -> uploads/{user_id}/
    Default images: folder="defaultImages/"
    """
    file_extension = file.filename.split(".")[-1]
    prefix = folder or f"uploads/{user_id}/"
    if not prefix.endswith("/"):
        prefix += "/"

    file_key = f"{prefix}{uuid4()}.{file_extension}"
    content_type = getattr(file, "content_type", None) or "application/octet-stream"

    try:
        s3_client.upload_fileobj(
            file.file,
            BUCKET,
            file_key,
            ExtraArgs={"ContentType": content_type}
        )
    except Exception as e:
        raise Exception(f"S3 upload failed: {e}")

    return f"{S3_BASE_URL}/{file_key}"


def upload_base64_to_s3(base64_str: str, folder: str = "defaultImages/") -> str:
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

    try:
        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=image_bytes,
            ContentType="image/png",
        )
    except NoCredentialsError:
        raise Exception("AWS credentials not found")

    return f"{S3_BASE_URL}/{key}"


def rekognition_detect_labels(s3_url: str, max_labels: int = 10, min_confidence: float = 80.0):
    """
    Detects labels in an image stored on S3.
    s3_url example: https://bucket-name.s3.region.amazonaws.com/uploads/...
    Returns: list of label names
    """
    try:
        # Extract bucket/key from URL
        bucket_start = s3_url.split("https://")[1]
        bucket, _, key = bucket_start.partition(".s3.")
        key = s3_url.split(f"{bucket}.s3.")[1].split(".amazonaws.com/")[1]

        response = rekognition_client.detect_labels(
            Image={"S3Object": {"Bucket": bucket, "Name": key}},
            MaxLabels=max_labels,
            MinConfidence=min_confidence,
        )

        labels = [label["Name"] for label in response["Labels"]]
        return labels

    except Exception as e:
        raise Exception(f"Rekognition label detection failed: {e}")
