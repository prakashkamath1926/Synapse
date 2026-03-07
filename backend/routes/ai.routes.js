import express from 'express';
import { generateRoadmap, analyzeError, processImageFeedback, chatWithAssistant, generateVisualSummary, generateMermaidDiagram } from '../services/orchestrator.service.js';
import { callBedrock, isBedrockConfigured } from '../services/bedrock.service.js';

const router = express.Router();

// 1. Roadmap Generator
router.post('/roadmap', async (req, res, next) => {
    try {
        const { goal, aiSettings } = req.body;
        if (!goal) return res.status(400).json({ error: 'Goal is required' });
        const result = await generateRoadmap(goal, aiSettings);
        res.json(result);
    } catch (error) {
        console.error('[ROADMAP]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. Error / Code Analysis
router.post('/feedback', async (req, res, next) => {
    try {
        const { code, question, aiSettings } = req.body;
        if (!code) return res.status(400).json({ error: 'Code/Answer is required' });
        const result = await analyzeError(code, question, aiSettings);
        res.json(result);
    } catch (error) {
        console.error('[FEEDBACK]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 3. Photo Review
router.post('/photo-review', async (req, res, next) => {
    try {
        const { imageFile, base64Image, imageType, context, aiSettings } = req.body;
        const result = await processImageFeedback(imageFile, base64Image, imageType, context, aiSettings);
        res.json(result);
    } catch (error) {
        console.error('[PHOTO-REVIEW]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. Chat (simple JSON, no streaming)
router.post('/chat', async (req, res, next) => {
    try {
        // AIAssistant payload is slightly different; using 'messages' instead of message/history
        const { messages, aiSettings } = req.body;
        if (!messages) return res.status(400).json({ error: 'Messages are required' });
        const result = await chatWithAssistant(messages, aiSettings);
        res.json(result);
    } catch (error) {
        console.error('[CHAT]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 5. Visual Summary Generator
router.post('/visual-summary', async (req, res, next) => {
    try {
        const { topic, aiSettings } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });
        const result = await generateVisualSummary(topic, aiSettings);
        res.json(result);
    } catch (error) {
        console.error('[VISUAL-SUMMARY]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/mermaid
router.post('/mermaid', async (req, res) => {
    try {
        const { topic, aiSettings } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const data = await generateMermaidDiagram(topic, aiSettings);
        res.json(data);
    } catch (error) {
        console.error('Mermaid Diagram Request Error:', error);
        res.status(500).json({ error: 'Failed to generate architecture diagram' });
    }
});

// TEST endpoint — verifies live AWS Bedrock connection
router.get('/test-bedrock', async (req, res) => {
    try {
        const configured = isBedrockConfigured();
        console.log('📡 Bedrock test — configured:', configured);
        if (!configured) return res.json({ ok: false, error: 'Bedrock credentials not configured in .env' });

        const result = await callBedrock(
            process.env.BEDROCK_CHAT_MODEL_ID || 'amazon.nova-micro-v1:0',
            'You are a test assistant.',
            [{ role: 'user', content: 'Reply with exactly one word: BEDROCK_OK' }]
        );
        res.json({ ok: true, response: result });
    } catch (e) {
        console.error('[TEST-BEDROCK]', e.message);
        res.status(500).json({ ok: false, error: e.message });
    }
});

export default router;
