# Deployment Workflow

This document describes the deployment strategy for GlycoGrit Frontend.

## Environment Overview

We maintain three environments:

### 1. Production Environment
- **Branch:** `master`
- **URL:** https://glycogrit.com
- **Purpose:** Live production site accessible to end users
- **Auto-deploy:** Yes, on push to master
- **Protection:** Branch protection enabled

### 2. Staging Environment
- **Branch:** `staging`
- **URL:** Will be configured at staging.glycogrit.com or via Vercel preview
- **Purpose:** Pre-production testing environment
- **Auto-deploy:** Yes, on push to staging
- **Protection:** Recommended

### 3. Development/Preview Environment
- **Branch:** Feature branches (e.g., `feature/*`)
- **URL:** Auto-generated Vercel preview URLs
- **Purpose:** Feature development and testing
- **Auto-deploy:** Yes, on push to any feature branch

## Deployment Flow

```
feature/xyz → staging → master
   (dev)      (test)   (prod)
```

### Step 1: Feature Development
1. Create a feature branch from `staging`:
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/your-feature-name
   ```

2. Develop your feature and commit changes:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

3. Push to GitHub:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Vercel automatically creates a preview deployment
5. Review the preview URL in the GitHub PR

### Step 2: Staging Deployment
1. Create a PR from your feature branch to `staging`
2. Get code review approval
3. Merge to `staging` branch
4. Vercel automatically deploys to staging environment
5. Test thoroughly on staging

### Step 3: Production Deployment
1. Once staging is tested and approved, create a PR from `staging` to `master`
2. Get final approval
3. Merge to `master`
4. Vercel automatically deploys to https://glycogrit.com
5. Monitor production for any issues

## Emergency Rollback

If production has issues:

1. **Quick Rollback via Vercel:**
   - Go to Vercel Dashboard
   - Navigate to Deployments
   - Find the last working deployment
   - Click "Promote to Production"

2. **Git Revert:**
   ```bash
   git checkout master
   git revert HEAD
   git push origin master
   ```

## Branch Protection Rules

### Master Branch (Recommended Settings)
- ✅ Require pull request reviews (at least 1)
- ✅ Require status checks to pass (CI/build)
- ✅ Require branches to be up to date
- ✅ Restrict who can push to matching branches
- ❌ Allow force pushes (disabled)

### Staging Branch (Recommended Settings)
- ✅ Require pull request reviews (optional but recommended)
- ✅ Require status checks to pass
- ❌ Allow force pushes (disabled)

## Environment Variables

If you need different configs for staging vs production:

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables with environment-specific values:
   - **Production:** Only used for master branch
   - **Preview:** Used for staging and feature branches
   - **Development:** Local development

Example:
- `VITE_API_URL`:
  - Production: `https://api.glycogrit.com`
  - Staging: `https://staging-api.glycogrit.com`
  - Development: `http://localhost:3000`

## Monitoring

### Check Deployment Status:
- Vercel Dashboard: https://vercel.com/glycogrits-projects
- GitHub Actions: Check PR status
- Production: https://glycogrit.com
- Staging: [URL will be configured]

### Logs:
- Vercel Deployments → Click deployment → View logs
- Check browser console for client-side errors
- Monitor Vercel Analytics for performance

## Best Practices

1. **Never commit directly to master** - Always use PRs
2. **Test on staging first** - Don't skip staging
3. **Small, frequent deployments** - Easier to debug
4. **Write descriptive commit messages** - Helps with rollbacks
5. **Tag releases** - Use semantic versioning
6. **Monitor after deployment** - Check for errors immediately

## Hotfix Process

For urgent production fixes:

1. Create hotfix branch from master:
   ```bash
   git checkout master
   git checkout -b hotfix/urgent-fix
   ```

2. Make the fix and test locally

3. Create PR to master (can skip staging for critical issues)

4. Deploy immediately after merge

5. Backport to staging:
   ```bash
   git checkout staging
   git cherry-pick <commit-hash>
   git push origin staging
   ```

## Commands Cheat Sheet

```bash
# Start new feature
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# Deploy to staging
git push origin feature/my-feature
# Create PR to staging on GitHub

# Deploy to production
# Create PR from staging to master on GitHub

# Check current environment
git branch  # Shows current branch

# Pull latest changes
git pull origin <branch-name>

# Emergency production rollback
git checkout master
git revert HEAD
git push origin master
```

## Support

For deployment issues:
- Check Vercel logs
- Check GitHub Actions
- Contact team lead
- Review this documentation

Last Updated: 2024-04-13
