#!/bin/bash

# CloudFront and Custom Domain Setup
set -e

BUCKET_NAME=$1
DOMAIN_NAME=$2
REGION="us-east-1"

if [ -z "$BUCKET_NAME" ] || [ -z "$DOMAIN_NAME" ]; then
    echo "Usage: $0 <bucket-name> <domain-name>"
    echo "Example: $0 loansathi-app-123456 loansathi.com"
    exit 1
fi

echo "☁️ Setting up CloudFront for LoanSathi"
echo "======================================"

# Create CloudFront distribution configuration
cat > cloudfront-config.json << EOF
{
  "CallerReference": "loansathi-$(date +%s)",
  "Comment": "LoanSathi - Smart Loan Calculator",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$BUCKET_NAME",
        "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET_NAME",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
echo "🌍 Creating CloudFront distribution..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    --query 'Distribution.Id' --output text)

echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo "⏳ Distribution is being deployed (this may take 10-15 minutes)..."

# Wait for distribution to be deployed
aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id $DISTRIBUTION_ID \
    --query 'Distribution.DomainName' --output text)

echo "✅ CloudFront distribution deployed!"
echo "🌐 CloudFront URL: https://$CLOUDFRONT_DOMAIN"

# Clean up
rm cloudfront-config.json

echo ""
echo "📋 Next Steps for Custom Domain:"
echo "1. Create hosted zone in Route 53 for $DOMAIN_NAME"
echo "2. Request SSL certificate in ACM for $DOMAIN_NAME"
echo "3. Update CloudFront distribution with custom domain"
echo "4. Create Route 53 record pointing to CloudFront"
echo ""
echo "💡 Your app is now available at: https://$CLOUDFRONT_DOMAIN"
