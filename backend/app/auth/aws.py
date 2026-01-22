# backend/app/auth/aws.py

# ======================================
# AWS CONFIGURATION
# ======================================

# ======================================
# IMPORTS
# ======================================
import os
import boto3
from botocore.exceptions import ClientError
from typing import Optional

# ======================================
# AWS CONFIGURATION
# ======================================
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# Lazy-loaded clients
_s3_client: Optional[boto3.client] = None
_rekognition_client: Optional[boto3.client] = None


# ======================================
# CLIENT GETTERS (Lazy initialization)
# ======================================
def get_s3_client():
    """Get or create S3 client (lazy initialization)"""
    global _s3_client
    if _s3_client is None:
        if not AWS_REGION:
            raise ValueError("AWS_REGION environment variable is not set")
        _s3_client = boto3.client(
            "s3",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
    return _s3_client


def get_rekognition_client():
    """Get or create Rekognition client (lazy initialization)"""
    global _rekognition_client
    if _rekognition_client is None:
        if not AWS_REGION:
            raise ValueError("AWS_REGION environment variable is not set")
        _rekognition_client = boto3.client(
            "rekognition",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
    return _rekognition_client


# Note: Clients are created lazily via get_s3_client() and get_rekognition_client()
# This allows the app to start even if AWS credentials aren't configured
# Errors will only occur when trying to use AWS features