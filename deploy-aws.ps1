# Synapse AWS Deployment Script (PowerShell - Windows)
# Deploys the Vite build to S3 and invalidates CloudFront cache.
#
# Prerequisites:
#   1. AWS CLI installed (winget install Amazon.AWSCLI)
#   2. Run: aws configure (set your access key, secret, region)
#   3. An S3 bucket created for static hosting
#   4. A CloudFront distribution pointing to the S3 bucket
#
# Usage:
#   .\deploy-aws.ps1

$ErrorActionPreference = "Stop"

# ─── Configuration ─────────────────────────────────────────
$S3_BUCKET = "your-s3-bucket-name"
$CLOUDFRONT_DISTRIBUTION_ID = "your-cloudfront-id"
$AWS_REGION = "ap-south-1"  # Mumbai

# ─── Build ─────────────────────────────────────────────────
Write-Host "`n🔨 Building production bundle..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed!" }

# ─── Deploy to S3 ──────────────────────────────────────────
Write-Host "`n📦 Uploading to S3: s3://$S3_BUCKET" -ForegroundColor Cyan
aws s3 sync dist/ "s3://$S3_BUCKET" `
    --region $AWS_REGION `
    --delete `
    --cache-control "public, max-age=31536000, immutable" `
    --exclude "index.html" `
    --exclude "*.json"

# Upload index.html with no-cache
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" `
    --region $AWS_REGION `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html"

# ─── Invalidate CloudFront ─────────────────────────────────
if ($CLOUDFRONT_DISTRIBUTION_ID -ne "your-cloudfront-id") {
    Write-Host "`n🌐 Invalidating CloudFront cache..." -ForegroundColor Cyan
    aws cloudfront create-invalidation `
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID `
        --paths "/*"
    Write-Host "✅ CloudFront invalidation started." -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipping CloudFront (no distribution ID set)." -ForegroundColor Yellow
}

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "   S3: https://$S3_BUCKET.s3.$AWS_REGION.amazonaws.com"
