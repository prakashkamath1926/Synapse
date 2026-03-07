import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';
dotenv.config();

// ── Bedrock Model IDs ──────────────────────────────────────────────────────────
// Using Amazon Nova Micro — the cheapest Bedrock model (text-only)
export const BEDROCK_MODELS = {
    chat: process.env.BEDROCK_CHAT_MODEL_ID || 'amazon.nova-micro-v1:0',
    roadmap: process.env.BEDROCK_ROADMAP_MODEL_ID || 'amazon.nova-micro-v1:0',
    feedback: process.env.BEDROCK_FEEDBACK_MODEL_ID || 'amazon.nova-micro-v1:0',
};

// ── AWS Bedrock Client ─────────────────────────────────────────────────────────
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ...(process.env.AWS_SESSION_TOKEN
                    ? { sessionToken: process.env.AWS_SESSION_TOKEN }
                    : {}),
            },
        }
        : {}), // Falls back to AWS SDK default credential chain (IAM role / env / config)
});

/**
 * Check if AWS Bedrock credentials are configured.
 */
export function isBedrockConfigured() {
    const hasExplicitCreds =
        !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;
    const hasProfileOrRole =
        process.env.AI_PROVIDER === 'bedrock'; // Allow role-based auth if provider=bedrock
    return hasExplicitCreds || hasProfileOrRole;
}

/**
 * Call AWS Bedrock using the Converse-compatible InvokeModel API.
 * Supports Amazon Nova models (nova-micro, nova-lite, nova-pro).
 *
 * @param {string} modelId   - Bedrock model ID (e.g. 'amazon.nova-micro-v1:0')
 * @param {string} system    - System prompt string
 * @param {Array}  messages  - Array of { role: 'user'|'assistant', content: string }
 * @param {number} maxTokens - Maximum tokens to generate (default: 1024)
 * @returns {Promise<string>} - Generated text response
 */
export async function callBedrock(modelId, system, messages, maxTokens = 1024) {
    console.log(`📡 Calling Bedrock: model=${modelId}, messages=${messages.length}`);

    const requestBody = {
        messages: messages.map((msg) => {
            const contentBlock = [];

            // Text block (guard against empty strings which cause errors)
            if (msg.content && msg.content.trim()) {
                contentBlock.push({ text: msg.content });
            }

            // Vision block: embed base64 image if provided
            if (msg.image && msg.image.base64 && msg.image.format) {
                let format = msg.image.format.toLowerCase();
                if (format === 'jpg') format = 'jpeg';
                if (!['jpeg', 'png', 'gif', 'webp'].includes(format)) format = 'jpeg';

                contentBlock.push({
                    image: {
                        format: format,
                        source: { bytes: msg.image.base64 }
                    }
                });
            }

            // Safety: always ensure at least a text block exists to avoid Nova rejection 
            if (contentBlock.length === 0) {
                contentBlock.push({ text: '(no content)' });
            }

            return { role: msg.role, content: contentBlock };
        })
    };

    // Only attach system if it's non-empty
    if (system && system.trim()) {
        requestBody.system = [{ text: system }];
    }

    console.log('📤 Bedrock request body preview:', JSON.stringify(requestBody).slice(0, 300));

    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    console.log('📥 Bedrock response keys:', Object.keys(responseBody));

    if (responseBody.output?.message?.content?.[0]?.text) {
        const text = responseBody.output.message.content[0].text;
        console.log('✅ Bedrock response OK, length:', text.length);
        return text;
    }

    console.error('❌ Unexpected Bedrock response format:', JSON.stringify(responseBody).slice(0, 500));
    throw new Error('Unexpected Bedrock response format: ' + JSON.stringify(responseBody).slice(0, 200));
}
