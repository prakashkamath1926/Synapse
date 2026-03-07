#!/bin/bash
# Synapse AWS Deployment Script
# Deploys the Vite build to S3 and invalidates CloudFront cache.
#
# Prerequisites:
#   1. AWS CLI installed and configured (aws configure)
#   2. An S3 bucket created for static hosting
#   3. A CloudFront distribution pointing to the S3 bucket
#
# Usage:
#   chmod +x deploy-aws.sh
#   ./deploy-aws.sh

set -e

# ─── Configuration ─────────────────────────────────────────
S3_BUCKET="your-s3-bucket-name"
CLOUDFRONT_DISTRIBUTION_ID="your-cloudfront-id"
AWS_REGION="ap-south-1"  # Mumbai region for India

# ─── Build ─────────────────────────────────────────────────
echo "🔨 Building production bundle..."
npm run build

# ─── Deploy to S3 ──────────────────────────────────────────
echo "📦 Uploading to S3: s3://$S3_BUCKET"
aws s3 sync dist/ "s3://$S3_BUCKET" \
    --region "$AWS_REGION" \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "*.json"

# Upload index.html and JSON with no-cache (so updates are instant)
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" \
    --region "$AWS_REGION" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html"

# ─── Invalidate CloudFront ─────────────────────────────────
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && [ "$CLOUDFRONT_DISTRIBUTION_ID" != "your-cloudfront-id" ]; then
    echo "🌐 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*"
    echo "✅ CloudFront invalidation started."
else
    echo "⚠️  Skipping CloudFront invalidation (no distribution ID set)."
fi

echo ""
echo "✅ Deployment complete!"
echo "   S3: https://$S3_BUCKET.s3.$AWS_REGION.amazonaws.com"
echo "   If CloudFront is configured, your site is live on your domain."
