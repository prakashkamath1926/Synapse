import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { callBedrock, isBedrockConfigured } from './services/bedrock.service.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', aiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Synapse Backend is running 🧠' });
});

// Direct Bedrock connectivity test
app.get('/test-bedrock', async (req, res) => {
    try {
        const configured = isBedrockConfigured();
        if (!configured) return res.json({ ok: false, error: 'Credentials not in .env' });
        const result = await callBedrock(
            process.env.BEDROCK_CHAT_MODEL_ID || 'amazon.nova-micro-v1:0',
            'You are a testing assistant.',
            [{ role: 'user', content: 'Say exactly: BEDROCK_OK' }]
        );
        res.json({ ok: true, response: result });
    } catch (e) {
        console.error('[TEST-BEDROCK]', e.message);
        res.status(500).json({ ok: false, error: e.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong in the AI Orchestrator'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Synapse Backend listening on port ${PORT}`);
});
