import express from 'express';
import { generateRoadmap, analyzeError, processImageFeedback, chatWithAssistant } from '../services/orchestrator.service.js';

const router = express.Router();

// 1. Roadmap Generator
router.post('/roadmap', async (req, res, next) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ error: 'Goal is required' });
        const result = await generateRoadmap(goal);
        res.json(result);
    } catch (error) {
        console.error('[ROADMAP]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. Error / Code Analysis
router.post('/feedback', async (req, res, next) => {
    try {
        const { code, question } = req.body;
        if (!code) return res.status(400).json({ error: 'Code/Answer is required' });
        const result = await analyzeError(code, question);
        res.json(result);
    } catch (error) {
        console.error('[FEEDBACK]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 3. Photo Review
router.post('/photo-review', async (req, res, next) => {
    try {
        const { imageFile, context } = req.body;
        const result = await processImageFeedback(imageFile, context);
        res.json(result);
    } catch (error) {
        console.error('[PHOTO-REVIEW]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. Chat (simple JSON, no streaming)
router.post('/chat', async (req, res, next) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });
        const result = await chatWithAssistant(message, history);
        res.json(result);
    } catch (error) {
        console.error('[CHAT]', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
