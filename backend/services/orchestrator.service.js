import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

console.log(`✅ Ollama Orchestrator ready: ${OLLAMA_MODEL} @ ${OLLAMA_URL}`);

// ── helper: call Ollama and get text back ──────────────────────────────────────
async function ollamaChat(messages, jsonMode = false) {
    const body = {
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: { temperature: 0.7, num_predict: 2048 }
    };
    if (jsonMode) body.format = 'json';

    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        throw new Error(`Ollama HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.message?.content || '';
}

// ── helper: extract JSON from raw text ────────────────────────────────────────
function extractJSON(text) {
    // Strip markdown fences if present
    const clean = text
        .replace(/^```json\s*/gi, '')
        .replace(/^```\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .trim();

    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object in response');
    return JSON.parse(clean.substring(start, end + 1));
}

// ── 1. Roadmap Generator ───────────────────────────────────────────────────────
export const generateRoadmap = async (goal) => {
    const messages = [
        {
            role: 'system',
            content: 'You are an expert curriculum designer. You MUST return ONLY a valid JSON object with no extra text, no markdown fences, no explanation.'
        },
        {
            role: 'user',
            content: `Create a 3-month learning roadmap for: "${goal}".
Each month has 4 weeks. Each week has 5 daily topics specific to "${goal}".

Return EXACTLY this JSON structure:
{"title":"Roadmap: ${goal}","totalMonths":3,"months":[{"id":1,"title":"Foundation","weeks":[{"id":1,"title":"Week Title","days":[{"day":1,"topic":"Topic Name"},{"day":2,"topic":"Topic Name"},{"day":3,"topic":"Topic Name"},{"day":4,"topic":"Topic Name"},{"day":5,"topic":"Topic Name"}]}]}]}`
        }
    ];

    const text = await ollamaChat(messages, true);
    const parsed = extractJSON(text);

    // Normalize structure
    if (parsed.months) {
        parsed.months = parsed.months.map((m, mi) => ({
            id: m.id ?? mi + 1,
            title: m.title || `Month ${mi + 1}`,
            weeks: (m.weeks || []).map((w, wi) => ({
                id: w.id ?? wi + 1,
                title: w.title || `Week ${wi + 1}`,
                days: w.days || (w.topics || []).map((t, di) => ({ day: di + 1, topic: t })),
                topics: w.topics || (w.days || []).map(d => d.topic)
            }))
        }));
    }

    console.log(`✅ Roadmap generated for "${goal}"`);
    return parsed;
};

// ── 2. Error / Code Analysis ───────────────────────────────────────────────────
export const analyzeError = async (code, question) => {
    const messages = [
        {
            role: 'system',
            content: 'You are a code reviewer. Return ONLY a valid JSON object, no extra text.'
        },
        {
            role: 'user',
            content: `Analyze this code/answer and return JSON.
Question: ${question || 'None'}
Code: ${code}

Return: {"mistake":"describe the mistake","concept":"underlying concept","correction":"corrected version","suggestion":"how to improve"}`
        }
    ];

    const text = await ollamaChat(messages, true);
    return extractJSON(text);
};

// ── 3. Photo Review ───────────────────────────────────────────────────────────
export const processImageFeedback = async (imageFile, context) => {
    const messages = [
        {
            role: 'system',
            content: 'You are an academic reviewer. Return ONLY a valid JSON object, no extra text.'
        },
        {
            role: 'user',
            content: `Review this student work. Context: ${context || 'General assignment review'}.
Return: {"score":"A/B/C/D","strengths":["point 1","point 2"],"missing":["gap 1","gap 2"],"suggestions":["tip 1","tip 2"],"note":"overall comment"}`
        }
    ];

    const text = await ollamaChat(messages, true);
    return extractJSON(text);
};

// ── 4. Chat — non-streaming (simple, reliable) ─────────────────────────────────
export const chatWithAssistant = async (message, history = []) => {
    const messages = [
        {
            role: 'system',
            content: 'You are Synapse AI, a friendly and concise learning assistant. Help users understand concepts clearly. Keep responses under 200 words.'
        }
    ];

    for (const msg of history.slice(-6)) {
        messages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.text || msg.content || ''
        });
    }
    messages.push({ role: 'user', content: message });

    const reply = await ollamaChat(messages, false);
    return { reply };
};
