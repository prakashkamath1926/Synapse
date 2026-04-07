// Vercel Serverless API — powered by Groq (qwen/qwen3-32b)
// Handles: /api/roadmap  /api/chat  /api/feedback  /api/motivation/check

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Helpers ──────────────────────────────────────────────────────────────────

async function groqChat(systemPrompt, userContent) {
  const completion = await groq.chat.completions.create({
    model: 'qwen/qwen3-32b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userContent },
    ],
    temperature: 0.6,
    max_completion_tokens: 4096,
    top_p: 0.95,
    reasoning_effort: 'default',
    stream: false,
    stop: null,
  });
  return completion.choices[0]?.message?.content ?? '';
}

function safeJSON(text) {
  // Strip markdown code fences if model wraps JSON in ```json ... ```
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

// ── Route handlers ────────────────────────────────────────────────────────────

async function handleRoadmap(body) {
  const { goal } = body;
  if (!goal) throw new Error('Missing "goal" in request body');

  const system = `You are an expert learning path designer. 
Always respond with ONLY valid JSON matching this exact schema — no prose, no markdown fences:
{
  "title": "string",
  "months": [
    {
      "id": number,
      "title": "string",
      "weeks": [
        { "id": number, "title": "string", "topics": ["string"] }
      ]
    }
  ]
}`;

  const raw = await groqChat(system, `Create a detailed 3-month learning roadmap for: ${goal}`);
  return safeJSON(raw);
}

async function handleChat(body) {
  const { message, history = [] } = body;
  if (!message) throw new Error('Missing "message" in request body');

  const system = `You are Synapse, a friendly and brilliant AI tutor. 
Explain concepts with vivid analogies and concrete examples. Keep answers concise (3-5 sentences max) 
but deeply insightful. You are talking to a learner who is eager but may be a beginner.`;

  // Build conversation turns from history
  const messages = [
    { role: 'system', content: system },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: 'qwen/qwen3-32b',
    messages,
    temperature: 0.7,
    max_completion_tokens: 1024,
    top_p: 0.95,
    reasoning_effort: 'default',
    stream: false,
  });

  return { reply: completion.choices[0]?.message?.content ?? '' };
}

async function handleFeedback(body) {
  const { code } = body;
  if (!code) throw new Error('Missing "code" in request body');

  const system = `You are an expert code reviewer and debugger.
Always respond with ONLY valid JSON matching this exact schema — no prose, no markdown fences:
{
  "status": "string (e.g. Error Detected / Looks Good)",
  "mistake": "string — describe the specific bug or issue",
  "conceptGap": "string — the underlying concept the learner misunderstands",
  "explanation": "string — clear explanation of why it's wrong",
  "suggestion": "string — corrected snippet or concrete fix advice"
}`;

  const raw = await groqChat(system, `Analyze this code and find the main error or issue:\n\n${code}`);
  return safeJSON(raw);
}

async function handleMotivation(body) {
  const { progress } = body;

  const system = `You are a supportive motivational coach for learners.
Always respond with ONLY valid JSON — no prose, no markdown fences:
{
  "message": "string — uplifting, personalized motivational message (2 sentences)",
  "tip": "string — one actionable study tip",
  "mood": "string — one of: energized | focused | calm | resilient"
}`;

  const raw = await groqChat(system, `Give encouragement based on this learner progress: ${JSON.stringify(progress)}`);
  return safeJSON(raw);
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path = [] } = req.query;
  const route = (Array.isArray(path) ? path.join('/') : path).toLowerCase();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
  }

  try {
    let result;
    if (route === 'roadmap') {
      result = await handleRoadmap(req.body);
    } else if (route === 'chat') {
      result = await handleChat(req.body);
    } else if (route === 'feedback') {
      result = await handleFeedback(req.body);
    } else if (route === 'motivation/check') {
      result = await handleMotivation(req.body);
    } else {
      return res.status(404).json({ error: `Unknown route: /api/${route}` });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(`[Groq API] Error on /api/${route}:`, err);
    return res.status(500).json({ error: err.message });
  }
}
