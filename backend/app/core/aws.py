# app/core/aws.py
import os
import boto3
from botocore.exceptions import ClientError

AWS_REGION = os.getenv("AWS_REGION", "us-west-1")

s3_client = boto3.client("s3", region_name=AWS_REGION)
rekognition_client = boto3.client("rekognition", region_name=AWS_REGION)

async def s3_upload_file(file, user_id):
    key = f"users/{user_id}/{file.filename}"
    try:
        s3_client.upload_fileobj(file.file, "your-bucket-name", key)
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return f"https://your-bucket-name.s3.amazonaws.com/{key}"

async def rekognition_detect_labels(s3_url):
    # extract bucket & key from URL
    parts = s3_url.replace("https://", "").split("/")
    bucket = parts[0]
    key = "/".join(parts[1:])
    response = rekognition_client.detect_labels(
        Image={"S3Object": {"Bucket": bucket, "Name": key}},
        MaxLabels=10,
        MinConfidence=75
    )
    return [label["Name"] for label in response["Labels"]]
