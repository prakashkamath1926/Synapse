import dotenv from 'dotenv';
import { callBedrock, BEDROCK_MODELS, isBedrockConfigured } from './bedrock.service.js';

dotenv.config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

console.log(`✅ AI Provider: ${AI_PROVIDER}`);
if (AI_PROVIDER === 'bedrock' && isBedrockConfigured()) {
    console.log(`✅ AWS Bedrock configured: ${BEDROCK_MODELS.chat}`);
} else if (AI_PROVIDER === 'ollama') {
    console.log(`✅ Ollama configured: ${OLLAMA_MODEL} @ ${OLLAMA_URL}`);
}

// ── Helper: Route to correct AI provider ──────────────────────────────────────
async function callAI(systemPrompt, userPrompt, jsonMode = false, maxTokens = 2048) {
    if (AI_PROVIDER === 'bedrock' && isBedrockConfigured()) {
        // Use AWS Bedrock
        const messages = [{ role: 'user', content: userPrompt }];
        return await callBedrock(BEDROCK_MODELS.chat, systemPrompt, messages, maxTokens);
    } else {
        // Fallback to Ollama
        return await ollamaChat(
            [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            jsonMode
        );
    }
}

// ── Ollama helper (fallback) ──────────────────────────────────────────────────
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

// ── Helper: Extract JSON from text ────────────────────────────────────────────
function extractJSON(text) {
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
    const systemPrompt = 'You are an expert curriculum designer. You MUST return ONLY a valid JSON object with no extra text, no markdown fences, no explanation.';
    
    const userPrompt = `Create a 3-month learning roadmap for: "${goal}".
Each month has 4 weeks. Each week has 5 daily topics specific to "${goal}".

Return EXACTLY this JSON structure:
{"title":"Roadmap: ${goal}","totalMonths":3,"months":[{"id":1,"title":"Foundation","weeks":[{"id":1,"title":"Week Title","days":[{"day":1,"topic":"Topic Name"},{"day":2,"topic":"Topic Name"},{"day":3,"topic":"Topic Name"},{"day":4,"topic":"Topic Name"},{"day":5,"topic":"Topic Name"}]}]}]}`;

    const text = await callAI(systemPrompt, userPrompt, true, 2048);
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
    const systemPrompt = 'You are a code reviewer. Return ONLY a valid JSON object, no extra text.';
    
    const userPrompt = `Analyze this code/answer and return JSON.
Question: ${question || 'None'}
Code: ${code}

Return: {"mistake":"describe the mistake","concept":"underlying concept","correction":"corrected version","suggestion":"how to improve"}`;

    const text = await callAI(systemPrompt, userPrompt, true, 1024);
    return extractJSON(text);
};

// ── 3. Photo Review ───────────────────────────────────────────────────────────
export const processImageFeedback = async (imageFile, context) => {
    const systemPrompt = 'You are an academic reviewer. Return ONLY a valid JSON object, no extra text.';
    
    const userPrompt = `Review this student work. Context: ${context || 'General assignment review'}.
Return: {"score":"A/B/C/D","strengths":["point 1","point 2"],"missing":["gap 1","gap 2"],"suggestions":["tip 1","tip 2"],"note":"overall comment"}`;

    const text = await callAI(systemPrompt, userPrompt, true, 1024);
    return extractJSON(text);
};

// ── 4. Chat ────────────────────────────────────────────────────────────────────
export const chatWithAssistant = async (message, history = []) => {
    if (AI_PROVIDER === 'bedrock' && isBedrockConfigured()) {
        // Bedrock with conversation history
        const systemPrompt = 'You are Synapse AI, a friendly and concise learning assistant. Help users understand concepts clearly. Keep responses under 200 words.';
        
        const messages = [];
        for (const msg of history.slice(-6)) {
            messages.push({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.text || msg.content || ''
            });
        }
        messages.push({ role: 'user', content: message });

        const reply = await callBedrock(BEDROCK_MODELS.chat, systemPrompt, messages, 512);
        return { reply };
    } else {
        // Ollama fallback
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
    }
};

// ── 5. Visual Summary Generator ────────────────────────────────────────────────
export const generateVisualSummary = async (topic) => {
    const systemPrompt = 'You are an expert technical instructor. Return ONLY a valid JSON object with no extra text or markdown.';
    
    const userPrompt = `Break down the topic "${topic}" into a logical, step-by-step visual flow. Provide between 5 and 7 steps.
For each step, intelligently select a relevant Lucide icon name (in PascalCase, e.g., "Brain", "Cpu", "Activity", "Zap", "Leaf") and a kinetic animation style from this exact list: ["spin", "pulse", "float", "bounce", "glow"].
Return EXACTLY this JSON structure, and absolutely nothing else:
{"title":"${topic}","steps":[{"label":"Step Name","detail":"Short explanation of this step (1-2 sentences max)","icon":"ActionIcon","animation":"float"}]}`;

    const text = await callAI(systemPrompt, userPrompt, true, 1024);
    const parsed = extractJSON(text);

    if (!parsed.steps || !Array.isArray(parsed.steps)) {
        throw new Error("AI returned an invalid step structure.");
    }

    console.log(`✅ Visual Summary generated for "${topic}"`);
    return parsed;
};

// ── 6. Mermaid Mind Map Generator ──────────────────────────────────────────────
export const generateMermaidDiagram = async (topic) => {
    const systemPrompt = 'You are an expert technical architect. Return ONLY a valid JSON object with no extra padding or markdown blocks.';
    
    const userPrompt = `Write a COMPLETELY VALID, highly-detailed Mermaid.js diagram encapsulating the topic "${topic}".
- Use either \`graph TD\` (for flowcharts) or \`mindmap\` (for hierarchical breakdowns).
- Do NOT use markdown backticks inside the diagram string itself.
- Ensure node names are simple and do not contain special characters that break Mermaid syntax.

Return EXACTLY this JSON structure, and absolutely nothing else:
{"title":"${topic}","diagram":"mindmap\\n  root((Topic))\\n    Branch 1\\n      Child"}`;

    const text = await callAI(systemPrompt, userPrompt, true, 1024);
    const parsed = extractJSON(text);

    if (!parsed.diagram) {
        throw new Error("AI returned an invalid diagram structure.");
    }

    console.log(`✅ Mermaid Diagram generated for "${topic}"`);
    return parsed;
};
