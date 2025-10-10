import boto3, os
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile
from typing import Optional
from uuid import uuid4

AWS_REGION = os.getenv("AWS_REGION")
BUCKET = os.getenv("AWS_BUCKET_NAME")

if not BUCKET:
    raise ValueError("AWS_BUCKET_NAME enviroment variable is not set.")

S3_BASE_URL = f"https://{BUCKET}.s3.{AWS_REGION}.amazonaws.com"

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)


def upload_file_to_s3(
    file: UploadFile,
    user_id: str,
    folder: Optional[str] = None
) -> str:
    """
    Upload a file to AWS S3 and return its public URL.
    Automatically sets the correct ContentType.
    """
    file_extension = file.filename.split(".")[-1]
    # If folder provided, don't append 'uploads/'
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
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": content_type
            },
        )
    except Exception as e:
        raise Exception(f"S3 upload failed: {e}")

    return f"{S3_BASE_URL}/{file_key}"    
    
    
    

# print(os.getenv("AWS_BUCKET_NAME"))  # should print 'pynsight'
def upload_base64_to_s3(base64_str: str, folder: str = "libraryDefaults/") -> str:
    """
    Upload a Base64 image to S3 under the given folder and return public URL
    """
    # strip header if present
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

    return f"https://{BUCKET}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"


