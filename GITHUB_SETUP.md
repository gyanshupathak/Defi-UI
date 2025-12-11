# GitHub Setup Guide

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new (or click the "+" icon in the top right → "New repository")
2. Repository name: `lucidly-new-ui` (or any name you prefer)
3. Description: "Lucidly UI - Modern Dashboard Interface"
4. Visibility: Choose **Private** (recommended for work projects) or **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_REPO_NAME if different)
git remote add origin https://github.com/gyanshupathak/YOUR_REPO_NAME.git

# Rename branch to main (if not already)
git branch -M main

# Push your code
git push -u origin main
```

## Step 3: Add Your Senior as a Collaborator

### Option A: Through GitHub Web Interface (Easiest)

1. Go to your repository on GitHub: `https://github.com/gyanshupathak/YOUR_REPO_NAME`
2. Click on **Settings** tab (top navigation)
3. In the left sidebar, click **Collaborators**
4. Click **Add people** button
5. Enter your senior's GitHub username or email
6. Choose permission level:
   - **Write** - Can push code and make changes (recommended)
   - **Admin** - Full access including settings
7. Click **Add [username] to this repository**
8. Your senior will receive an email invitation

### Option B: Through GitHub CLI (If you have it installed)

```bash
gh repo add-collaborator gyanshupathak/YOUR_REPO_NAME SENIOR_GITHUB_USERNAME --permission write
```

## Step 4: Share Repository Link

Send your senior the repository URL:
```
https://github.com/gyanshupathak/YOUR_REPO_NAME
```

## Quick Commands Reference

```bash
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View remotes
git remote -v
```

