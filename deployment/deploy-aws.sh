#!/bin/bash

# LoanSathi AWS Deployment Script
set -e

# Configuration
BUCKET_NAME="loansathi-app-$(date +%s)"
REGION="us-east-1"
DOMAIN_NAME="loansathi.com"  # Change this to your domain

echo "🚀 Deploying LoanSathi to AWS"
echo "=============================="

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Create S3 bucket
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html

# Set bucket policy for public read access
echo "🔓 Setting bucket policy..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js"

# Upload HTML files with different cache settings
aws s3 sync dist/ s3://$BUCKET_NAME --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js"

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Deployment completed!"
echo "🌐 Website URL: $WEBSITE_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Test your website: $WEBSITE_URL"
echo "2. Setup CloudFront for CDN (optional but recommended)"
echo "3. Configure custom domain with Route 53 (optional)"
echo ""
echo "💡 To setup CloudFront and custom domain, run:"
echo "   ./setup-cloudfront.sh $BUCKET_NAME $DOMAIN_NAME"
