import boto3
import json
import os
import time
import re


def _make_s3_client():
    kwargs = {"region_name": os.getenv("AWS_REGION", "us-east-1")}
    key = os.getenv("AWS_ACCESS_KEY_ID")
    secret = os.getenv("AWS_SECRET_ACCESS_KEY")
    token = os.getenv("AWS_SESSION_TOKEN")
    if key and secret:
        kwargs["aws_access_key_id"] = key
        kwargs["aws_secret_access_key"] = secret
        if token:
            kwargs["aws_session_token"] = token
    return boto3.client("s3", **kwargs)


def upload_visual_summary_to_s3(topic: str, data: dict) -> str | None:
    """
    Upload a generated visual summary JSON to the configured S3 bucket.
    Returns the S3 object key on success, None if not configured or on error.
    """
    bucket = os.getenv("AWS_S3_BUCKET_NAME")
    if not bucket:
        print("⚠️  AWS_S3_BUCKET_NAME not set — skipping S3 upload")
        return None

    try:
        safe_topic = re.sub(r"[^a-z0-9]", "_", topic.lower())
        key = f"visual-summaries/{safe_topic}_{int(time.time())}.json"

        s3 = _make_s3_client()
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=json.dumps(data, indent=2),
            ContentType="application/json",
        )
        print(f"✅ Uploaded to S3: s3://{bucket}/{key}")
        return key
    except Exception as e:
        print(f"❌ S3 upload failed: {e}")
        return None
