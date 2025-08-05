#!/bin/bash

# LoanSathi Vercel Deployment Script
set -e

echo "🚀 Deploying LoanSathi to Vercel"
echo "================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment completed!"
echo ""
echo "📋 Your LoanSathi app is now live!"
echo "🌐 Check your Vercel dashboard for the URL"
echo ""
echo "💡 To add a custom domain:"
echo "1. Go to your Vercel dashboard"
echo "2. Select the loansathi project"
echo "3. Go to Settings > Domains"
echo "4. Add your custom domain"
