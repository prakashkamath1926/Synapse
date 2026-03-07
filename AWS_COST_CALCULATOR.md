# AWS Cost Calculator for Synapse

## Amazon Nova Micro Pricing

**Input tokens**: $0.035 per 1M tokens  
**Output tokens**: $0.14 per 1M tokens

### Token Estimation Guide

| Action | Avg Input | Avg Output | Cost per Request |
|--------|-----------|------------|------------------|
| Chat message | 200 tokens | 150 tokens | $0.000028 |
| Roadmap generation | 300 tokens | 2000 tokens | $0.000291 |
| Code feedback | 500 tokens | 300 tokens | $0.000060 |
| Visual summary | 250 tokens | 400 tokens | $0.000065 |
| Mermaid diagram | 200 tokens | 300 tokens | $0.000049 |

### Monthly Usage Scenarios

#### Light Usage (100 users, 10 requests/user/month)
- 1,000 total requests
- ~500K input tokens, ~400K output tokens
- **Cost**: ~$0.07/month

#### Medium Usage (500 users, 20 requests/user/month)
- 10,000 total requests
- ~5M input tokens, ~4M output tokens
- **Cost**: ~$0.73/month

#### Heavy Usage (2,000 users, 50 requests/user/month)
- 100,000 total requests
- ~50M input tokens, ~40M output tokens
- **Cost**: ~$7.35/month

#### Very Heavy Usage (10,000 users, 100 requests/user/month)
- 1,000,000 total requests
- ~500M input tokens, ~400M output tokens
- **Cost**: ~$73.50/month

## AWS App Runner Pricing

**Compute**: $0.064 per vCPU-hour + $0.007 per GB-hour

### Configuration Options

#### Minimal (0.25 vCPU, 0.5 GB)
- **Cost**: ~$5.76/month (always running)
- Good for: Testing, low traffic

#### Small (0.5 vCPU, 1 GB)
- **Cost**: ~$11.52/month
- Good for: 100-500 users

#### Medium (1 vCPU, 2 GB)
- **Cost**: ~$23.04/month
- Good for: 500-2000 users

#### Large (2 vCPU, 4 GB)
- **Cost**: ~$46.08/month
- Good for: 2000+ users

**Auto-scaling**: Only pay when traffic increases

## AWS Amplify Hosting Pricing

**Build minutes**: $0.01 per minute  
**Storage**: $0.023 per GB/month  
**Data transfer**: $0.15 per GB (first 15 GB free)

### Typical Costs

- **Build**: 5 minutes/deploy × 10 deploys/month = $0.50
- **Storage**: 100 MB = $0.002
- **Traffic**: 10 GB/month = Free (under 15 GB)
- **Total**: ~$0.50-2/month

## DynamoDB Pricing (On-Demand)

**Write**: $1.25 per million write requests  
**Read**: $0.25 per million read requests  
**Storage**: $0.25 per GB/month

### Usage Scenarios

#### Light (1,000 users)
- 100K writes, 500K reads/month
- 1 GB storage
- **Cost**: ~$0.50/month

#### Medium (5,000 users)
- 500K writes, 2M reads/month
- 5 GB storage
- **Cost**: ~$2.13/month

#### Heavy (20,000 users)
- 2M writes, 10M reads/month
- 20 GB storage
- **Cost**: ~$8.00/month

## Total Monthly Cost Estimates

### Scenario 1: Testing/Development
- Bedrock: $0.10
- App Runner (minimal): $5.76
- Amplify: $0.50
- DynamoDB: $0.50
- **Total**: ~$7/month
- **$300 credits last**: 42 months

### Scenario 2: Small Production (500 users)
- Bedrock: $1.00
- App Runner (small): $11.52
- Amplify: $1.00
- DynamoDB: $2.00
- **Total**: ~$15.52/month
- **$300 credits last**: 19 months

### Scenario 3: Medium Production (2,000 users)
- Bedrock: $5.00
- App Runner (medium): $23.04
- Amplify: $2.00
- DynamoDB: $5.00
- **Total**: ~$35/month
- **$300 credits last**: 8.5 months

### Scenario 4: Large Production (10,000 users)
- Bedrock: $20.00
- App Runner (large): $46.08
- Amplify: $5.00
- DynamoDB: $15.00
- Data Transfer: $10.00
- **Total**: ~$96/month
- **$300 credits last**: 3 months

## Cost Optimization Tips

### 1. Use Bedrock Efficiently
- Cache common responses
- Limit max tokens (use 512 instead of 2048 when possible)
- Implement rate limiting

### 2. App Runner Auto-Scaling
- Set minimum instances to 1
- Scale down during low traffic hours
- Use health checks to prevent unnecessary instances

### 3. Amplify Optimization
- Enable build caching
- Use incremental builds
- Optimize bundle size

### 4. DynamoDB Optimization
- Use batch operations
- Enable TTL for temporary data
- Consider provisioned capacity for predictable traffic

### 5. General AWS Tips
- Enable AWS Cost Anomaly Detection
- Set up billing alerts at $20, $50, $100
- Use AWS Cost Explorer weekly
- Tag all resources for tracking

## Budget Alert Setup

```bash
# Create a budget alert
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

**budget.json**:
```json
{
  "BudgetName": "Synapse-Monthly-Budget",
  "BudgetLimit": {
    "Amount": "50",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

**notifications.json**:
```json
[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80
    },
    "Subscribers": [
      {
        "SubscriptionType": "EMAIL",
        "Address": "your-email@example.com"
      }
    ]
  }
]
```

## Real-Time Cost Monitoring

Check current month costs:
```bash
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## Free Tier Benefits (First 12 Months)

- **EC2**: 750 hours/month (not using)
- **RDS**: 750 hours/month db.t2.micro
- **S3**: 5 GB storage, 20K GET, 2K PUT
- **Lambda**: 1M requests/month (if you add serverless functions)
- **CloudFront**: 50 GB data transfer

**Note**: App Runner and Bedrock are NOT part of free tier, but are very cost-effective.
