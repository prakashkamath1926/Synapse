import httpx
import json
import os


OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:8b")


async def ollama_chat(messages: list[dict], json_mode: bool = False) -> str:
    """
    Call the local Ollama API with a list of messages.
    Returns the raw text response.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
    }
    if json_mode:
        payload["format"] = "json"

    async with httpx.AsyncClient(timeout=120.0) as client:
        res = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
        res.raise_for_status()
        data = res.json()
        return data.get("message", {}).get("content", "")
