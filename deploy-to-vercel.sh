#!/bin/bash

# LoanSathi - Automated Vercel Deployment
set -e

echo "🏦 LoanSathi - Deploying to Vercel Free Tier"
echo "============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the application
echo "🔨 Building application for production..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📦 Bundle size: $(du -sh dist | cut -f1)"
echo ""

# Check if Vercel CLI is available and user is logged in
if command -v vercel &> /dev/null; then
    echo "🔍 Checking Vercel authentication..."
    if vercel whoami &> /dev/null; then
        echo "✅ Vercel CLI authenticated"
        echo ""
        echo "🚀 Deploying to Vercel..."
        
        # Deploy to production
        vercel --prod --yes
        
        echo ""
        echo "🎉 Deployment completed!"
        echo "📱 Your LoanSathi app is now live!"
        
    else
        echo "⚠️  Vercel CLI found but not authenticated"
        echo ""
        echo "Please run: vercel login"
        echo "Then run this script again"
        echo ""
        echo "🔄 Alternative: Use drag & drop method"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up for free"
        echo "3. Drag the 'dist' folder to deploy"
    fi
else
    echo "📋 Vercel CLI not found. Here are your deployment options:"
    echo ""
    echo "🎯 Option 1: Drag & Drop (Easiest)"
    echo "1. Go to https://vercel.com"
    echo "2. Sign up for free account"
    echo "3. Drag the 'dist' folder to the deployment area"
    echo ""
    echo "🎯 Option 2: GitHub Integration (Recommended)"
    echo "1. Push your code to GitHub"
    echo "2. Connect GitHub to Vercel"
    echo "3. Import and deploy your repository"
    echo ""
    echo "🎯 Option 3: Install CLI and deploy"
    echo "npm install -g vercel"
    echo "vercel login"
    echo "./deploy-to-vercel.sh"
fi

echo ""
echo "📊 What you get on Vercel FREE tier:"
echo "✅ Global CDN"
echo "✅ SSL Certificate"
echo "✅ Custom domains"
echo "✅ 100GB bandwidth/month"
echo "✅ Unlimited static sites"
echo ""
echo "💰 Cost: $0/month (FREE!)"
echo ""
echo "📖 For detailed instructions, see: VERCEL_DEPLOY.md"
