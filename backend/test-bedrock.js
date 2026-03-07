/**
 * test-bedrock.js
 * Quick test to verify AWS Bedrock connectivity with Nova Micro.
 * Run: node test-bedrock.js
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';
dotenv.config();

const MODEL_ID = process.env.BEDROCK_CHAT_MODEL_ID || 'amazon.nova-micro-v1:0';
const REGION = process.env.AWS_REGION || 'us-east-1';

async function testBedrock() {
    console.log(`\n🧪 Testing AWS Bedrock`);
    console.log(`   Region : ${REGION}`);
    console.log(`   Model  : ${MODEL_ID}`);
    console.log(`   Key ID : ${process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.slice(0, 8) + '...' : '(not set — using default credentials)'}\n`);

    const client = new BedrockRuntimeClient({
        region: REGION,
        ...(process.env.AWS_ACCESS_KEY_ID && {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
            },
        }),
    });

    const requestBody = {
        messages: [{ role: 'user', content: [{ text: 'Say "Bedrock is connected!" in exactly 5 words.' }] }],
        system: [{ text: 'You are a helpful assistant.' }],
        inferenceConfig: { maxNewTokens: 50, temperature: 0.5 },
    };

    try {
        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody),
        });

        const response = await client.send(command);
        const body = JSON.parse(new TextDecoder().decode(response.body));
        const text = body.output?.message?.content?.[0]?.text;

        if (text) {
            console.log('✅ SUCCESS! Bedrock responded:');
            console.log(`   "${text}"\n`);
        } else {
            console.error('❌ Unexpected response format:', JSON.stringify(body, null, 2));
        }
    } catch (err) {
        console.error('❌ Bedrock test FAILED:', err.message);
        if (err.name === 'AccessDeniedException') {
            console.error('   → Check IAM permissions: bedrock:InvokeModel');
            console.error('   → Enable model access in AWS Console → Bedrock → Model Access');
        } else if (err.name === 'CredentialsProviderError') {
            console.error('   → Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
        } else if (err.name === 'ValidationException') {
            console.error(`   → Model "${MODEL_ID}" may not be available in region "${REGION}"`);
        }
        process.exit(1);
    }
}

testBedrock();
