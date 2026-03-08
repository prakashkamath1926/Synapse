import json
import re
from typing import Optional
from services.ollama_service import ollama_chat
from services.bedrock_service import call_bedrock, BEDROCK_MODELS, is_bedrock_configured
from services.s3_service import upload_visual_summary_to_s3
from models.schemas import AISettings


# ── Helpers ────────────────────────────────────────────────────────────────────

def extract_json(text: str) -> dict | list:
    """Strip markdown fences and parse JSON from AI output."""
    clean = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE | re.MULTILINE)
    clean = re.sub(r"^```\s*", "", clean, flags=re.IGNORECASE | re.MULTILINE)
    clean = re.sub(r"```\s*$", "", clean, flags=re.MULTILINE).strip()
    return json.loads(clean)


async def execute_llm(
    messages: list[dict],
    ai_settings: Optional[AISettings],
    json_mode: bool = False,
    bedrock_model_id: Optional[str] = None,
    force_bedrock: bool = False,
) -> str:
    """
    Route the LLM call to either AWS Bedrock or local Ollama based on settings.
    `force_bedrock=True` always routes to Bedrock (used by Photo Review).
    """
    use_ollama = ai_settings.useOllama if ai_settings else True
    use_bedrock = (ai_settings.useBedrock if ai_settings else False) or force_bedrock

    if (use_bedrock and not use_ollama) or force_bedrock:
        if not is_bedrock_configured():
            raise ValueError("AWS Bedrock selected but credentials not configured in .env")

        model = bedrock_model_id or BEDROCK_MODELS["chat"]
        system = ""
        bedrock_msgs = list(messages)

        if bedrock_msgs and bedrock_msgs[0].get("role") == "system":
            system = bedrock_msgs[0]["content"]
            bedrock_msgs = bedrock_msgs[1:]

        return call_bedrock(model, system, bedrock_msgs, max_tokens=2048)

    # Default → Ollama
    ollama_messages = []
    for m in messages:
        msg: dict = {"role": m["role"], "content": m.get("content", "")}
        if m.get("image", {}).get("base64"):
            msg["images"] = [m["image"]["base64"]]
        ollama_messages.append(msg)

    return await ollama_chat(ollama_messages, json_mode=json_mode)


# ── 1. Roadmap Generator ───────────────────────────────────────────────────────

async def generate_roadmap(goal: str, ai_settings: Optional[AISettings] = None) -> dict:
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert educational roadmap generator. "
                "Return ONLY a valid JSON object with no extra text or markdown. "
                "Schema: {\"title\":string, \"description\":string, \"phases\":[{\"phase\":number,\"title\":string,\"duration\":string,\"topics\":[string],\"resources\":[string]}]}"
            ),
        },
        {"role": "user", "content": f"Create a comprehensive, phased learning roadmap for: {goal}"},
    ]
    text = await execute_llm(messages, ai_settings, json_mode=True, bedrock_model_id=BEDROCK_MODELS["roadmap"])
    return extract_json(text)


# ── 2. Error Analysis ──────────────────────────────────────────────────────────

async def analyze_error(
    error: str,
    code: Optional[str] = None,
    language: str = "unknown",
    ai_settings: Optional[AISettings] = None,
) -> dict:
    user_content = f"Language: {language}\nError: {error}"
    if code:
        user_content += f"\nCode:\n{code}"

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert debugging assistant. "
                "Return ONLY a valid JSON object. "
                "Schema: {\"diagnosis\":string, \"explanation\":string, \"fix\":string, \"prevention\":string}"
            ),
        },
        {"role": "user", "content": user_content},
    ]
    text = await execute_llm(messages, ai_settings, json_mode=True)
    return extract_json(text)


# ── 3. Photo Review (always Bedrock) ──────────────────────────────────────────

async def process_image_feedback(
    image_file: Optional[str] = None,
    base64_image: Optional[str] = None,
    image_type: str = "image/jpeg",
    context: str = "",
    ai_settings: Optional[AISettings] = None,
) -> dict:
    user_content = "Analyze this image for educational quality and provide structured feedback."
    if context:
        user_content += f" Context: {context}"

    user_msg: dict = {"role": "user", "content": user_content}
    if base64_image:
        fmt = image_type.split("/")[-1] if image_type else "jpeg"
        user_msg["image"] = {"base64": base64_image, "format": fmt}

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert educational content analyst specializing in visual learning materials. "
                "Return ONLY a valid JSON object. "
                "Schema: {\"overall_score\":number, \"clarity\":number, \"educational_value\":number, "
                "\"visual_design\":number, \"strengths\":[string], \"improvements\":[string], \"recommendations\":[string]}"
            ),
        },
        user_msg,
    ]
    text = await execute_llm(
        messages, ai_settings,
        json_mode=True,
        bedrock_model_id=BEDROCK_MODELS["feedback"],
        force_bedrock=True,
    )
    return extract_json(text)


# ── 4. Chat ───────────────────────────────────────────────────────────────────

async def chat_with_assistant(
    messages_input: list[dict],
    ai_settings: Optional[AISettings] = None,
) -> dict:
    messages = [
        {
            "role": "system",
            "content": (
                "You are Synapse AI, a friendly and concise learning assistant. "
                "Help users understand concepts clearly. Keep responses under 200 words."
            ),
        }
    ]
    for msg in messages_input[-6:]:
        messages.append({
            "role": "assistant" if msg.get("role") == "assistant" else "user",
            "content": msg.get("text") or msg.get("content") or "",
        })

    reply = await execute_llm(messages, ai_settings, json_mode=False, bedrock_model_id=BEDROCK_MODELS["chat"])
    return {"reply": reply}


# ── 5. Visual Summary (with S3 upload) ────────────────────────────────────────

async def generate_visual_summary(topic: str, ai_settings: Optional[AISettings] = None) -> dict:
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert technical instructor. Return ONLY a valid JSON object. "
                "Schema: {\"title\":string, \"steps\":[{\"step\":number,\"label\":string,\"detail\":string,"
                "\"icon\":string,\"animation\":string}]} — provide 5-7 steps."
            ),
        },
        {"role": "user", "content": f"Create a kinetic, step-by-step visual summary for: {topic}"},
    ]
    text = await execute_llm(messages, ai_settings, json_mode=True)
    parsed = extract_json(text)

    if not isinstance(parsed.get("steps"), list):
        raise ValueError("AI returned an invalid step structure.")

    print(f"✅ Visual Summary generated for \"{topic}\"")
    upload_visual_summary_to_s3(topic, parsed)
    return parsed


# ── 6. Mermaid Diagram ────────────────────────────────────────────────────────

async def generate_mermaid_diagram(topic: str, ai_settings: Optional[AISettings] = None) -> dict:
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert in system architecture and visual diagrams. "
                "Your ONLY output must be a raw mermaid.js diagram string — NO explanations, "
                "NO markdown fences, NO extra text. Use graph TD, mindmap, or flowchart as appropriate."
            ),
        },
        {"role": "user", "content": f"Generate a comprehensive mermaid.js architecture diagram for: {topic}"},
    ]
    text = await execute_llm(messages, ai_settings, json_mode=False)
    clean = re.sub(r"^```(?:mermaid)?\s*", "", text.strip(), flags=re.IGNORECASE)
    clean = re.sub(r"```\s*$", "", clean).strip()
    return {"diagram": clean}
