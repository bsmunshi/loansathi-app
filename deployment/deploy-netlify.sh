#!/bin/bash

# LoanSathi Netlify Deployment Script
set -e

echo "🚀 Deploying LoanSathi to Netlify"
echo "=================================="

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment completed!"
echo ""
echo "📋 Your LoanSathi app is now live!"
echo "🌐 Check the URL provided above"
echo ""
echo "💡 To add a custom domain:"
echo "1. Go to your Netlify dashboard"
echo "2. Select the loansathi site"
echo "3. Go to Site settings > Domain management"
echo "4. Add your custom domain"
