# app/core/aws.py

# ======================================
# AWS CONFIGURATION
# ======================================

# ======================================
# IMPORTS
# ======================================
import os
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

# ======================================
# AWS FALLBACKS
# ======================================
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# ======================================
# BOTO 3 CLIENT
# ======================================
s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

# ======================================
# REKOGNITION CLIENT
# ======================================
rekognition_client = boto3.client(
    "rekognition",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)