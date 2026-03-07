# Quick Guide: Switch from Ollama to AWS Bedrock

## Step 1: Update Backend Environment

Edit `backend/.env` and add:

```env
# Switch AI Provider
AI_PROVIDER=bedrock

# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here

# Bedrock Models
BEDROCK_CHAT_MODEL_ID=amazon.nova-micro-v1:0
BEDROCK_ROADMAP_MODEL_ID=amazon.nova-micro-v1:0
BEDROCK_FEEDBACK_MODEL_ID=amazon.nova-micro-v1:0
```

## Step 2: Replace Orchestrator Service

Run this command in your terminal:

```bash
# Windows (PowerShell)
copy backend\services\orchestrator-bedrock.service.js backend\services\orchestrator.service.js

# Or manually rename the file
```

## Step 3: Test Bedrock Connection

```bash
cd backend
node test-bedrock.js
```

Expected output:
```
📡 Calling Bedrock: model=amazon.nova-micro-v1:0
✅ Bedrock response received
```

## Step 4: Restart Backend

```bash
cd backend
npm start
```

## Step 5: Test API Endpoints

```bash
# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello, explain photosynthesis briefly\"}"
```

## Rollback to Ollama

If you need to switch back:

1. Change `AI_PROVIDER=ollama` in `backend/.env`
2. Restart backend

The code automatically falls back to Ollama if Bedrock is not configured.

## Cost Monitoring

Check your Bedrock usage:
```bash
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://bedrock-filter.json
```

Create `bedrock-filter.json`:
```json
{
  "Dimensions": {
    "Key": "SERVICE",
    "Values": ["Amazon Bedrock"]
  }
}
```
