import boto3
import os

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_REGION")
)

BUCKET_NAME = os.environ.get("pynsight")

def upload_to_s3(file_path, key):
    s3.upload_file(file_path, BUCKET_NAME, key)
    url = f"https://{BUCKET_NAME}.s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{key}"
    return url


def generate_presigned_url(key, expiration=3600):
    return s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': BUCKET_NAME, 'Key': key},
        ExpiresIn=expiration
    )
