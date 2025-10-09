import boto3, os
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile
from uuid import uuid4

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)

BUCKET = os.getenv("AWS_BUCKET_NAME")

if not BUCKET:
    raise ValueError("AWS_BUCKET_NAME enviroment variable is not set.")


# For user-uploaded files
def upload_file_to_s3(file: UploadFile, user_id: str, folder: str = "libraryDefaults/"):
    """
    Upload a file to S3 and return the public URL.
    If folder is specified, it will be used in the S3 key instead of user_id.
    """
    try:
        file_extension = file.filename.split(".")[-1]
        key = f"{folder}{user_id}/{uuid4()}.{file_extension}" if folder else f"{user_id}/{uuid4()}.{file_extension}"
        s3_client.upload_fileobj(
            file.file,
            BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type} 
        )
        return f"https://{BUCKET}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
    except NoCredentialsError:
        raise Exception("AWS credentials not found")

    
    
    
    

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