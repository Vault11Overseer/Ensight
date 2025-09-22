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

BUCKET = os.getenv("AWS_S3_BUCKET")

def upload_file_to_s3(file: UploadFile, user_id: str):
    try:
        file_extension = file.filename.split(".")[-1]
        key = f"{user_id}/{uuid4()}.{file_extension}"
        s3_client.upload_fileobj(
            file.file,
            BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type}
        )
        return f"https://{BUCKET}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
    except NoCredentialsError:
        raise Exception("AWS credentials not found")
