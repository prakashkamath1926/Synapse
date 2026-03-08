from pydantic import BaseModel
from typing import Optional, List, Any


class AISettings(BaseModel):
    useOllama: bool = True
    useBedrock: bool = False


class ChatMessage(BaseModel):
    role: str
    text: Optional[str] = None
    content: Optional[str] = None

    def get_content(self) -> str:
        return self.text or self.content or ""


class RoadmapRequest(BaseModel):
    goal: str
    aiSettings: Optional[AISettings] = None


class ErrorAnalysisRequest(BaseModel):
    error: str
    code: Optional[str] = None
    language: Optional[str] = "unknown"
    aiSettings: Optional[AISettings] = None


class PhotoReviewRequest(BaseModel):
    imageFile: Optional[str] = None
    base64Image: Optional[str] = None
    imageType: Optional[str] = "image/jpeg"
    context: Optional[str] = ""
    aiSettings: Optional[AISettings] = None


class ChatRequest(BaseModel):
    messages: Optional[List[ChatMessage]] = None
    message: Optional[str] = None      # backward-compat
    history: Optional[List[ChatMessage]] = None  # backward-compat
    aiSettings: Optional[AISettings] = None


class VisualSummaryRequest(BaseModel):
    topic: str
    aiSettings: Optional[AISettings] = None


class MermaidRequest(BaseModel):
    topic: str
    aiSettings: Optional[AISettings] = None
