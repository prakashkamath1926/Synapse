from fastapi import APIRouter, HTTPException
from models.schemas import (
    RoadmapRequest, ErrorAnalysisRequest, PhotoReviewRequest,
    ChatRequest, VisualSummaryRequest, MermaidRequest, AISettings,
)
from services.orchestrator import (
    generate_roadmap, analyze_error, process_image_feedback,
    chat_with_assistant, generate_visual_summary, generate_mermaid_diagram,
)
from services.bedrock_service import call_bedrock, is_bedrock_configured, BEDROCK_MODELS
import os

router = APIRouter(prefix="/api")


# ── 1. Roadmap Generator ──────────────────────────────────────────────────────
@router.post("/roadmap")
async def roadmap(req: RoadmapRequest):
    if not req.goal:
        raise HTTPException(status_code=400, detail="goal is required")
    try:
        result = await generate_roadmap(req.goal, req.aiSettings)
        return result
    except Exception as e:
        print(f"[ROADMAP] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 2. Error Analysis ─────────────────────────────────────────────────────────
@router.post("/error-analysis")
async def error_analysis(req: ErrorAnalysisRequest):
    if not req.error:
        raise HTTPException(status_code=400, detail="error is required")
    try:
        result = await analyze_error(req.error, req.code, req.language or "unknown", req.aiSettings)
        return result
    except Exception as e:
        print(f"[ERROR-ANALYSIS] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 3. Photo Review ───────────────────────────────────────────────────────────
@router.post("/photo-review")
async def photo_review(req: PhotoReviewRequest):
    try:
        result = await process_image_feedback(
            req.imageFile, req.base64Image, req.imageType or "image/jpeg",
            req.context or "", req.aiSettings,
        )
        return result
    except Exception as e:
        print(f"[PHOTO-REVIEW] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 4. Chat ───────────────────────────────────────────────────────────────────
@router.post("/chat")
async def chat(req: ChatRequest):
    # Support both new format (messages[]) and old format (message + history)
    messages = []
    if req.messages:
        messages = [m.model_dump() for m in req.messages]
    elif req.message:
        history = [m.model_dump() for m in req.history] if req.history else []
        messages = history + [{"role": "user", "text": req.message, "content": req.message}]

    if not messages:
        raise HTTPException(status_code=400, detail="messages are required")

    try:
        result = await chat_with_assistant(messages, req.aiSettings)
        return result
    except Exception as e:
        print(f"[CHAT] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 5. Visual Summary ─────────────────────────────────────────────────────────
@router.post("/visual-summary")
async def visual_summary(req: VisualSummaryRequest):
    if not req.topic:
        raise HTTPException(status_code=400, detail="topic is required")
    try:
        result = await generate_visual_summary(req.topic, req.aiSettings)
        return result
    except Exception as e:
        print(f"[VISUAL-SUMMARY] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 6. Mermaid Diagram ────────────────────────────────────────────────────────
@router.post("/mermaid")
async def mermaid(req: MermaidRequest):
    if not req.topic:
        raise HTTPException(status_code=400, detail="topic is required")
    try:
        result = await generate_mermaid_diagram(req.topic, req.aiSettings)
        return result
    except Exception as e:
        print(f"[MERMAID] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 7. Bedrock Connectivity Test ──────────────────────────────────────────────
@router.get("/test-bedrock")
async def test_bedrock():
    try:
        configured = is_bedrock_configured()
        if not configured:
            return {"ok": False, "error": "Bedrock credentials not configured in .env"}

        result = call_bedrock(
            os.getenv("BEDROCK_CHAT_MODEL_ID", "amazon.nova-micro-v1:0"),
            "You are a test assistant.",
            [{"role": "user", "content": "Reply with exactly one word: BEDROCK_OK"}],
        )
        return {"ok": True, "response": result}
    except Exception as e:
        print(f"[TEST-BEDROCK] {e}")
        raise HTTPException(status_code=500, detail=str(e))
