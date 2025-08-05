# 🔐 GitHub Authentication Setup

## 🚨 Authentication Required

GitHub requires a Personal Access Token (not password) for pushing code. Here's how to set it up:

## 🔑 **Step 1: Create Personal Access Token**

1. **Go to GitHub**: [github.com](https://github.com)
2. **Click your profile picture** (top right) → **Settings**
3. **Scroll down** → Click **"Developer settings"** (left sidebar, bottom)
4. **Click "Personal access tokens"** → **"Tokens (classic)"**
5. **Click "Generate new token"** → **"Generate new token (classic)"**
6. **Fill in details**:
   - **Note**: `LoanSathi Deployment`
   - **Expiration**: `90 days` (or longer)
   - **Scopes**: ✅ Check **"repo"** (this gives full repository access)
7. **Click "Generate token"**
8. **⚠️ IMPORTANT**: Copy the token immediately (you won't see it again!)

## 🔧 **Step 2: Use Token to Push**

Once you have your token, run these commands:

```bash
cd /Users/munjalmunshi/bhushanDemo

# Push using your token (replace YOUR_TOKEN with actual token)
git push https://YOUR_TOKEN@github.com/bsmunshi/loansathi.git main
```

**Example**:
```bash
# If your token is: ghp_abc123xyz789
git push https://ghp_abc123xyz789@github.com/bsmunshi/loansathi.git main
```

## 🔄 **Alternative: Set Up Credential Helper**

For easier future pushes:

```bash
# Store credentials (will prompt for username and token)
git config --global credential.helper store

# Then push (it will ask for username and password)
git push -u origin main
# Username: bsmunshi
# Password: YOUR_TOKEN (paste your token here)
```

## 🎯 **Quick Steps Summary**

1. ✅ Create Personal Access Token on GitHub
2. ✅ Copy the token
3. ✅ Use token instead of password when pushing
4. ✅ Your code will be uploaded to GitHub

## 🆘 **Need Help?**

If you get stuck:
1. Make sure you created the `loansathi` repository on GitHub
2. Make sure the repository is **Public**
3. Double-check your token has **"repo"** permissions
4. Copy the token exactly (no extra spaces)

---

**Once you get your token, I can help you push the code!** 🚀
