import boto3
import json
import os
from botocore.exceptions import BotoCoreError, ClientError


# ── AWS Bedrock client ─────────────────────────────────────────────────────────
def _make_client():
    kwargs = {"region_name": os.getenv("AWS_REGION", "us-east-1")}
    key = os.getenv("AWS_ACCESS_KEY_ID")
    secret = os.getenv("AWS_SECRET_ACCESS_KEY")
    token = os.getenv("AWS_SESSION_TOKEN")
    if key and secret:
        kwargs["aws_access_key_id"] = key
        kwargs["aws_secret_access_key"] = secret
        if token:
            kwargs["aws_session_token"] = token
    return boto3.client("bedrock-runtime", **kwargs)


_bedrock_client = None


def get_bedrock_client():
    global _bedrock_client
    if _bedrock_client is None:
        _bedrock_client = _make_client()
    return _bedrock_client


# Model IDs
BEDROCK_MODELS = {
    "chat": os.getenv("BEDROCK_CHAT_MODEL_ID", "amazon.nova-micro-v1:0"),
    "roadmap": os.getenv("BEDROCK_ROADMAP_MODEL_ID", "amazon.nova-micro-v1:0"),
    "feedback": os.getenv("BEDROCK_FEEDBACK_MODEL_ID", "amazon.nova-lite-v1:0"),
}


def is_bedrock_configured() -> bool:
    return bool(os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"))


def call_bedrock(model_id: str, system: str, messages: list[dict], max_tokens: int = 2048) -> str:
    """
    Call AWS Bedrock InvokeModel API (Amazon Nova format).
    """
    client = get_bedrock_client()

    body_messages = []
    for msg in messages:
        content_blocks = []

        text = msg.get("content", "")
        if text and text.strip():
            content_blocks.append({"text": text})

        # Vision support: inline base64 image
        if msg.get("image"):
            img = msg["image"]
            fmt = img.get("format", "jpeg").lower()
            if fmt == "jpg":
                fmt = "jpeg"
            if fmt not in ("jpeg", "png", "gif", "webp"):
                fmt = "jpeg"
            content_blocks.append({
                "image": {
                    "format": fmt,
                    "source": {"bytes": img["base64"]}
                }
            })

        if not content_blocks:
            content_blocks = [{"text": "(no content)"}]

        body_messages.append({"role": msg["role"], "content": content_blocks})

    request_body = {"messages": body_messages}
    if system and system.strip():
        request_body["system"] = [{"text": system}]

    print(f"📡 Bedrock: model={model_id}, messages={len(messages)}")

    response = client.invoke_model(
        modelId=model_id,
        contentType="application/json",
        accept="application/json",
        body=json.dumps(request_body),
    )

    response_body = json.loads(response["body"].read())

    try:
        text = response_body["output"]["message"]["content"][0]["text"]
        print(f"✅ Bedrock OK, length={len(text)}")
        return text
    except (KeyError, IndexError) as e:
        raise ValueError(f"Unexpected Bedrock response format: {str(response_body)[:200]}")
