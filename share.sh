#!/bin/bash

# LoanSathi - Sharing Script
echo "🏦 LoanSathi - Smart Loan Calculator for India"
echo "=============================================="
echo ""

# Export Docker image
echo "📦 Exporting Docker image..."
docker save bhushandemo-loansathi:latest | gzip > loansathi.tar.gz

# Get file size
SIZE=$(ls -lh loansathi.tar.gz | awk '{print $5}')
echo "✅ Image exported successfully!"
echo "📁 File: loansathi.tar.gz (${SIZE})"
echo ""

echo "📋 Instructions for reviewers:"
echo "==============================="
echo ""
echo "1. Load the Docker image:"
echo "   docker load < loansathi.tar.gz"
echo ""
echo "2. Run the application:"
echo "   docker run -p 3000:80 bhushandemo-loansathi:latest"
echo ""
echo "3. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Health check:"
echo "   curl http://localhost:3000/health"
echo ""
echo "🎉 Happy reviewing!"
