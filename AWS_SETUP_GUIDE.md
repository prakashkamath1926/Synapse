# AWS Setup Guide for Synapse Learning Platform
**Budget: $300 credits | Estimated Monthly Cost: $15-40**

---

## Prerequisites
- AWS Account with $300 credits
- AWS CLI installed: `winget install Amazon.AWSCLI` (Windows)
- Git installed
- Node.js installed

---

## Phase 1: AWS Bedrock Setup (AI Service)

### Step 1.1: Enable Bedrock Model Access
1. Go to AWS Console: https://console.aws.amazon.com
2. Search for "Bedrock" in the top search bar
3. Click **"Model access"** in the left sidebar
4. Click **"Enable specific models"** or **"Manage model access"**
5. Find **"Amazon Nova Micro"** and click **"Request access"** (instant approval)
6. Wait 1-2 minutes for status to show "Access granted"

### Step 1.2: Create IAM User for Bedrock
1. Go to **IAM** service in AWS Console
2. Click **"Users"** → **"Create user"**
3. Username: `synapse-bedrock-user`
4. Click **Next** → Select **"Attach policies directly"**
5. Search and select: `AmazonBedrockFullAccess`
6. Click **"Create user"**

### Step 1.3: Generate Access Keys
1. Click on the user you just created
2. Go to **"Security credentials"** tab
3. Scroll to **"Access keys"** → Click **"Create access key"**
4. Select **"Application running outside AWS"**
5. Click **Next** → **Create access key**
6. **IMPORTANT**: Copy both:
   - Access Key ID
   - Secret Access Key
   (You won't see the secret again!)

### Step 1.4: Configure Backend Environment
1. Open `backend/.env` file (create if doesn't exist)
2. Add these lines:
```env
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here

# Bedrock Models (Amazon Nova Micro - cheapest)
BEDROCK_CHAT_MODEL_ID=amazon.nova-micro-v1:0
BEDROCK_ROADMAP_MODEL_ID=amazon.nova-micro-v1:0
BEDROCK_FEEDBACK_MODEL_ID=amazon.nova-micro-v1:0

# AI Provider Selection
AI_PROVIDER=bedrock
```

### Step 1.5: Update Orchestrator to Use Bedrock
Your code needs modification to switch from Ollama to Bedrock.

---

## Phase 2: Deploy Backend (AWS App Runner)

### Step 2.1: Prepare Backend for Deployment
1. Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

2. Create `backend/.dockerignore`:
```
node_modules
.env
*.log
```

### Step 2.2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/synapse.git
git push -u origin main
```

### Step 2.3: Deploy with App Runner
1. Go to **AWS App Runner** in console
2. Click **"Create service"**
3. Source: **"Source code repository"**
4. Connect to GitHub (authorize AWS)
5. Select your repository and branch `main`
6. Build settings:
   - Runtime: **Node.js 18**
   - Build command: `npm install`
   - Start command: `node server.js`
   - Port: `5000`
7. Environment variables: Add all from `backend/.env`
8. Click **"Create & deploy"**
9. Wait 5-10 minutes
10. Copy the service URL (e.g., `https://abc123.us-east-1.awsapprunner.com`)

**Cost**: ~$5-15/month (0.25 vCPU, 0.5 GB RAM)

---

## Phase 3: Deploy Frontend (AWS Amplify)

### Step 3.1: Deploy with Amplify
1. Go to **AWS Amplify** in console
2. Click **"New app"** → **"Host web app"**
3. Select **GitHub** → Authorize
4. Select your repository and branch
5. Build settings (auto-detected):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
6. Environment variables:
   - `VITE_SYNAPSE_API_URL`: Your App Runner URL from Phase 2
7. Click **"Save and deploy"**
8. Wait 5-10 minutes
9. Your app is live at: `https://main.d1234abcd.amplifyapp.com`

### Step 3.2: Add Custom Domain (Optional)
1. In Amplify console, click **"Domain management"**
2. Add your domain (if you have one)
3. Follow DNS configuration steps

**Cost**: ~$1-5/month (includes CDN, SSL)

---

## Phase 4: Add Database (Optional but Recommended)

### Option A: DynamoDB (Serverless, Pay-per-use)
1. Go to **DynamoDB** in console
2. Click **"Create table"**
3. Table name: `synapse-users`
4. Partition key: `userId` (String)
5. Use default settings (on-demand pricing)
6. Click **"Create table"**

**Cost**: Free tier: 25 GB storage, 25 WCU, 25 RCU

### Option B: RDS Free Tier (PostgreSQL)
1. Go to **RDS** in console
2. Click **"Create database"**
3. Select **PostgreSQL**
4. Template: **Free tier**
5. DB instance: `db.t3.micro`
6. Master username: `postgres`
7. Set password
8. Click **"Create database"**

**Cost**: Free for 12 months (750 hours/month)

---

## Phase 5: Testing & Monitoring

### Test Bedrock Integration
```bash
cd backend
node test-bedrock.js
```

### Monitor Costs
1. Go to **AWS Cost Explorer**
2. Enable **Cost Anomaly Detection**
3. Set budget alert:
   - Go to **AWS Budgets**
   - Create budget: $50/month
   - Set email alert at 80% ($40)

### Check Logs
- **App Runner**: Service → Logs tab
- **Amplify**: App → Build logs
- **Bedrock**: CloudWatch → Log groups

---

## Cost Breakdown (Estimated Monthly)

| Service | Cost | Usage |
|---------|------|-------|
| Bedrock (Nova Micro) | $5-20 | ~1M tokens/month |
| App Runner | $5-15 | 0.25 vCPU, 0.5GB RAM |
| Amplify Hosting | $1-5 | ~10GB bandwidth |
| DynamoDB | Free-$5 | On-demand |
| Data Transfer | $1-5 | Outbound traffic |
| **Total** | **$12-50/month** | |

**Your $300 credits will last 6-25 months!**

---

## Quick Commands Reference

### AWS CLI Configuration
```bash
aws configure
# Enter: Access Key ID, Secret Key, Region (us-east-1), Output (json)
```

### Test Bedrock from CLI
```bash
aws bedrock-runtime invoke-model \
  --model-id amazon.nova-micro-v1:0 \
  --body '{"messages":[{"role":"user","content":[{"text":"Hello"}]}],"inferenceConfig":{"maxNewTokens":100}}' \
  --region us-east-1 \
  output.json
```

### View App Runner Logs
```bash
aws apprunner list-services
aws logs tail /aws/apprunner/your-service-name --follow
```

---

## Troubleshooting

### Bedrock "Access Denied"
- Check IAM permissions: `AmazonBedrockFullAccess`
- Verify model access is enabled in Bedrock console
- Check AWS region matches (us-east-1)

### App Runner Build Fails
- Check Node.js version in Dockerfile
- Verify all dependencies in package.json
- Check environment variables are set

### Amplify Build Fails
- Check `VITE_SYNAPSE_API_URL` is set correctly
- Verify build command: `npm run build`
- Check output directory: `dist`

---

## Next Steps

1. ✅ Complete Phase 1 (Bedrock) first
2. ✅ Test locally with Bedrock
3. ✅ Deploy backend (Phase 2)
4. ✅ Deploy frontend (Phase 3)
5. ✅ Add database when needed (Phase 4)
6. ✅ Set up monitoring (Phase 5)

---

## Security Best Practices

- ✅ Never commit `.env` files to Git
- ✅ Use IAM roles instead of access keys when possible
- ✅ Enable MFA on AWS root account
- ✅ Rotate access keys every 90 days
- ✅ Use AWS Secrets Manager for production ($0.40/secret/month)

---

## Support Resources

- AWS Free Tier: https://aws.amazon.com/free
- Bedrock Pricing: https://aws.amazon.com/bedrock/pricing
- App Runner Docs: https://docs.aws.amazon.com/apprunner
- Amplify Docs: https://docs.amplify.aws
