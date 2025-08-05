# 🔒 Secure Deployment Guide

## ⚠️ SECURITY NOTICE

**NEVER commit sensitive information to git repositories:**
- Personal Access Tokens
- API Keys
- Passwords
- Private Keys
- OAuth Secrets

## 🔐 Secure GitHub Authentication

### Method 1: GitHub CLI (Recommended)
```bash
# Install GitHub CLI
brew install gh  # macOS
# or
sudo apt install gh  # Ubuntu

# Authenticate
gh auth login

# Push changes
git push origin main
```

### Method 2: SSH Keys (Most Secure)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub → Settings → SSH Keys

# Use SSH remote
git remote set-url origin git@github.com:bsmunshi/loansathi-app.git
git push origin main
```

### Method 3: Personal Access Token (Secure)
1. **Create token**: GitHub → Settings → Developer settings → Personal access tokens
2. **Use environment variable**:
   ```bash
   export GITHUB_TOKEN=your_token_here
   git push https://$GITHUB_TOKEN@github.com/bsmunshi/loansathi-app.git main
   ```
3. **Never commit the token to git**

## 🛡️ Security Best Practices

### Environment Variables
```bash
# Create .env.local (never commit this file)
echo "GITHUB_TOKEN=your_token" > .env.local
echo ".env.local" >> .gitignore
```

### Git Hooks
```bash
# Pre-commit hook to check for secrets
#!/bin/sh
if grep -r "ghp_\|gho_\|ghu_\|ghs_\|ghr_" --exclude-dir=.git .; then
    echo "❌ Potential GitHub token found!"
    exit 1
fi
```

### Repository Scanning
```bash
# Use git-secrets to prevent commits with secrets
git secrets --register-aws
git secrets --install
git secrets --scan
```

## 🔄 If You've Exposed Secrets

1. **Revoke immediately** on the platform (GitHub, AWS, etc.)
2. **Remove from git history**:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch filename' --prune-empty --tag-name-filter cat -- --all
   git push --force-with-lease origin main
   ```
3. **Rotate all related credentials**
4. **Audit access logs** for unauthorized usage

## ✅ Safe Deployment Workflow

```bash
# 1. Make changes
git add .
git commit -m "Your changes"

# 2. Use secure authentication
gh auth login  # or SSH keys

# 3. Push safely
git push origin main

# 4. Verify deployment
# Check Vercel dashboard for auto-deployment
```

## 🎯 For LoanSathi Specifically

Your app is now configured to:
- ✅ Use environment variables for OAuth credentials
- ✅ Never expose secrets in code
- ✅ Auto-deploy securely via Vercel
- ✅ Maintain security best practices

**Remember**: Security is not optional - it's essential! 🔒
