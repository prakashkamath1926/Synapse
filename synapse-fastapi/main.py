from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load env BEFORE importing services (they read env at module level)
load_dotenv()

from routes.ai_routes import router

app = FastAPI(
    title="Synapse AI Backend",
    description="FastAPI backend powering the Synapse learning platform — dual AI routing via Ollama and AWS Bedrock.",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Restrict to your Vite origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────────────────
app.include_router(router)


# ── Health Check ───────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    ollama_url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
    ollama_model = os.getenv("OLLAMA_MODEL", "qwen3:8b")
    return {
        "status": "ok",
        "message": "Synapse FastAPI Backend is running 🧠",
        "ollama": f"{ollama_model} @ {ollama_url}",
        "bedrock_configured": bool(os.getenv("AWS_ACCESS_KEY_ID")),
        "s3_bucket": os.getenv("AWS_S3_BUCKET_NAME", "not configured"),
    }


# ── Direct Bedrock test (outside /api prefix) ────────────────────────────────
@app.get("/test-bedrock")
async def test_bedrock_root():
    from routes.ai_routes import test_bedrock
    return await test_bedrock()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    print(f"🚀 Synapse FastAPI listening on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
