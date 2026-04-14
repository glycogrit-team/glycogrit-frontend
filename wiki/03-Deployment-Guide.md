# Deployment Guide

This document covers the complete deployment strategy for GlycoGrit, including Vercel setup, environment management, DNS configuration, and CI/CD workflows.

## Table of Contents
- [Overview](#overview)
- [Environments](#environments)
- [Vercel Setup](#vercel-setup)
- [DNS & Domain Configuration](#dns--domain-configuration)
- [Environment Variables](#environment-variables)
- [Deployment Workflow](#deployment-workflow)
- [Git Branching Strategy](#git-branching-strategy)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Debugging](#monitoring--debugging)

---

## Overview

**Hosting Platform:** Vercel
**Domain:** https://glycogrit.com
**Repository:** https://github.com/glycogrit-team/glycogrit-frontend
**Build Tool:** Vite
**Framework:** React 18

**Key Features:**
- ✅ Automatic deployments on git push
- ✅ Preview deployments for all branches
- ✅ Zero-downtime deployments
- ✅ Instant rollback capability
- ✅ Custom domain with SSL
- ✅ Edge network (CDN)

---

## Environments

We maintain **three environments**:

### 1. Production
- **Branch:** `master`
- **URL:** https://glycogrit.com
- **Purpose:** Live site for end users
- **Auto-deploy:** Yes
- **Protection:** Branch protection enabled
- **Approval:** Required for PRs

**Configuration:**
```json
{
  "branch": "master",
  "production": true,
  "domain": "glycogrit.com",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### 2. Staging
- **Branch:** `staging`
- **URL:** https://staging.glycogrit.com (or Vercel preview URL)
- **Purpose:** Pre-production testing
- **Auto-deploy:** Yes
- **Protection:** Recommended
- **Approval:** Optional

**Use cases:**
- QA testing before production
- Client review
- Integration testing
- Performance testing

### 3. Preview/Development
- **Branch:** Feature branches (`feature/*`, `fix/*`, `hotfix/*`)
- **URL:** Auto-generated Vercel preview URLs
- **Purpose:** Feature development and review
- **Auto-deploy:** Yes
- **Lifetime:** Temporary (removed when branch is deleted)

**Example URL:**
```
https://glycogrit-frontend-git-feature-xyz-glycogrit-team.vercel.app
```

---

## Vercel Setup

### Initial Setup

**1. Connect GitHub Repository**
```bash
# Navigate to https://vercel.com
1. Click "New Project"
2. Select "Import Git Repository"
3. Connect to glycogrit-team/glycogrit-frontend
4. Grant repository access
```

**2. Configure Project Settings**

**Framework Preset:** Vite

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

**Root Directory:** `./` (repository root)

**Node.js Version:** 20.x (matches local development)

**3. Environment-Specific Settings**

In Vercel Dashboard → Project Settings → Git:

```json
{
  "git": {
    "deploymentEnabled": {
      "master": true,
      "staging": true
    }
  },
  "github": {
    "silent": false,
    "autoAlias": true
  }
}
```

### Vercel Configuration File

Create `vercel.json` in project root:

```json
{
  "git": {
    "deploymentEnabled": {
      "master": true,
      "staging": true
    }
  },
  "github": {
    "silent": false,
    "autoAlias": true
  },
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

### Deployment Configuration

**Ignore Build Step (optional):**
```javascript
// vercel.json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- ./src"
}
```

This prevents rebuilds when only documentation changes.

---

## DNS & Domain Configuration

### Domain Setup at Namecheap

**Step 1: Add Domain to Vercel**
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `glycogrit.com` and `www.glycogrit.com`
4. Vercel will provide DNS records

**Step 2: Configure DNS at Namecheap**

Navigate to: Namecheap → Domain List → glycogrit.com → Advanced DNS

**Add A Record (for root domain):**
```
Type: A Record
Host: @
Value: 216.198.79.1
TTL: Automatic
```

**Add CNAME Record (for www subdomain):**
```
Type: CNAME Record
Host: www
Value: 73d1156814c96669.vercel-dns-017.com
TTL: Automatic
```

**Add CNAME Record (for staging - optional):**
```
Type: CNAME Record
Host: staging
Value: glycogrit-frontend-staging.vercel.app
TTL: Automatic
```

**Step 3: Verify Domain**
1. Return to Vercel Dashboard
2. Wait for DNS propagation (can take 1-48 hours)
3. Vercel will automatically issue SSL certificate
4. Domain status will change to "Valid"

### SSL/HTTPS
- **Automatic:** Vercel provides free SSL via Let's Encrypt
- **Renewal:** Automatic
- **Force HTTPS:** Enabled by default
- **HSTS:** Recommended (configure in Vercel Settings)

### Domain Verification Status

Check domain status:
```bash
# Check DNS propagation
dig glycogrit.com
dig www.glycogrit.com

# Check SSL certificate
curl -I https://glycogrit.com
```

---

## Environment Variables

### Managing Environment Variables

**Vercel Dashboard:**
```
Project Settings → Environment Variables
```

### Variable Scopes

**Production:**
- Used only for `master` branch
- Accessible in production builds

**Preview:**
- Used for `staging` and feature branches
- Accessible in preview deployments

**Development:**
- Used for local development
- Not sent to Vercel

### Example Configuration

**In Vercel Dashboard:**

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://api.glycogrit.com` | Production |
| `VITE_API_URL` | `https://staging-api.glycogrit.com` | Preview |
| `VITE_API_URL` | `http://localhost:8000` | Development |
| `VITE_APP_NAME` | `GlycoGrit` | All |
| `VITE_ANALYTICS_ID` | `UA-XXXXX-X` | Production |

**Local Development:**

Create `.env.local`:
```bash
# .env.local (not committed to git)
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=GlycoGrit Dev
VITE_DEBUG=true
```

### Environment Variable Best Practices

**DO ✅**
- Use `VITE_` prefix for client-exposed variables
- Set different values per environment
- Document all required variables in `.env.example`
- Never commit secrets to git
- Use separate API keys for staging/production

**DON'T ❌**
- Commit `.env.local` to git
- Hardcode sensitive values
- Use production keys in development
- Expose server-side secrets to client

### Accessing Environment Variables

```typescript
// In code
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Type-safe access
declare global {
  interface ImportMetaEnv {
    VITE_API_URL: string;
    VITE_APP_NAME: string;
    VITE_DEBUG?: boolean;
  }
}

export default import.meta.env;
```

---

## Deployment Workflow

### Standard Flow

```
feature/xyz → staging → master
   (dev)       (test)    (prod)
```

### Step 1: Feature Development

```bash
# 1. Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/challenge-filters

# 2. Develop and commit
git add .
git commit -m "Add challenge filters"

# 3. Push to GitHub
git push -u origin feature/challenge-filters
```

**Result:**
- Vercel automatically creates preview deployment
- Preview URL appears in GitHub PR comments
- Test your changes on preview URL

### Step 2: Deploy to Staging

```bash
# 1. Create PR from feature branch to staging
gh pr create --base staging --title "Add challenge filters"

# 2. Get code review and approval

# 3. Merge to staging
gh pr merge
```

**Result:**
- Vercel automatically deploys to staging environment
- Staging URL: https://staging.glycogrit.com
- Perform thorough testing on staging

### Step 3: Deploy to Production

```bash
# 1. Create PR from staging to master
gh pr create --base master --title "Release: Challenge filters"

# 2. Get final approval

# 3. Merge to master
gh pr merge
```

**Result:**
- Vercel automatically deploys to https://glycogrit.com
- Zero-downtime deployment
- Monitor for errors

### Deployment Commands

```bash
# View deployment status
vercel ls

# View logs for deployment
vercel logs glycogrit-frontend

# Inspect specific deployment
vercel inspect <deployment-url>

# Promote a deployment to production (manual)
vercel --prod
```

---

## Git Branching Strategy

### Branch Types

**1. Master Branch**
- Protected branch
- Production-ready code only
- Requires PR approval
- Direct pushes disabled

**2. Staging Branch**
- Integration branch
- Pre-production testing
- Accumulates features before production
- Can be reset if needed

**3. Feature Branches**
```
feature/*        # New features
fix/*            # Bug fixes
hotfix/*         # Emergency production fixes
chore/*          # Maintenance tasks
docs/*           # Documentation updates
```

### Branch Protection Rules

**Master Branch Protection:**
```yaml
Required:
  - ✅ Require pull request reviews (1 approver minimum)
  - ✅ Require status checks to pass
  - ✅ Require branches to be up to date before merging
  - ✅ Require conversation resolution before merging

Restrictions:
  - ❌ Allow force pushes: Disabled
  - ❌ Allow deletions: Disabled
  - ✅ Require signed commits: Recommended
```

**Staging Branch Protection:**
```yaml
Recommended:
  - ✅ Require status checks to pass
  - ✅ Require pull request reviews (optional)
  - ❌ Allow force pushes: Disabled
```

### Creating Branches

```bash
# Feature
git checkout -b feature/user-authentication

# Bug fix
git checkout -b fix/login-validation

# Hotfix (from master)
git checkout master
git checkout -b hotfix/critical-bug

# Documentation
git checkout -b docs/update-readme
```

---

## Rollback Procedures

### Method 1: Quick Rollback via Vercel Dashboard

**Steps:**
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click the three dots menu (⋯)
4. Click "Promote to Production"
5. Confirm rollback

**Time:** ~30 seconds
**Best for:** Immediate rollback

### Method 2: Git Revert

```bash
# 1. Identify problematic commit
git log --oneline -n 10

# 2. Revert the commit
git checkout master
git revert <commit-hash>

# 3. Push to trigger deployment
git push origin master
```

**Time:** ~2-3 minutes
**Best for:** Clean git history

### Method 3: Redeploy Previous Version

```bash
# 1. List deployments
vercel ls

# 2. Promote specific deployment
vercel promote <deployment-url> --prod
```

### Method 4: Emergency Hotfix

```bash
# 1. Create hotfix branch from last good commit
git checkout master
git checkout <last-good-commit>
git checkout -b hotfix/emergency-fix

# 2. Push and create emergency PR
git push -u origin hotfix/emergency-fix
gh pr create --base master --title "HOTFIX: Emergency rollback"

# 3. Merge immediately
gh pr merge
```

### Rollback Checklist

- [ ] Identify the issue and bad deployment
- [ ] Notify team of rollback
- [ ] Execute rollback via chosen method
- [ ] Verify site is working on production
- [ ] Monitor for errors in Vercel logs
- [ ] Create incident report
- [ ] Plan proper fix
- [ ] Update staging branch if needed

---

## Monitoring & Debugging

### Vercel Dashboard

**Real-time Monitoring:**
```
Dashboard → glycogrit-frontend
- Deployment status
- Build logs
- Runtime logs
- Analytics
- Speed insights
```

### Deployment Logs

```bash
# View recent logs
vercel logs

# Follow logs in real-time
vercel logs --follow

# Filter by type
vercel logs --filter="error"
```

### Build Logs

Check build logs for:
- TypeScript errors
- Missing dependencies
- Build failures
- Environment variable issues

### Runtime Logs

Monitor runtime logs for:
- API errors
- Console errors
- Network failures
- Performance issues

### Analytics

**Vercel Analytics Features:**
- Page views
- User metrics
- Performance scores
- Core Web Vitals
- Geographic distribution

**Access:**
```
Dashboard → Project → Analytics
```

### Performance Monitoring

**Speed Insights:**
```
Dashboard → Project → Speed Insights
```

**Metrics:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

### Error Tracking

**Recommended Tools:**
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (APM)

**Integration:**
```typescript
// src/lib/error-tracking.ts
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
    release: import.meta.env.VITE_APP_VERSION
  });
}
```

### Health Checks

Create a health check endpoint:
```typescript
// src/pages/Health.tsx
export default function Health() {
  return (
    <div>
      <h1>OK</h1>
      <p>Version: {import.meta.env.VITE_APP_VERSION}</p>
      <p>Build: {import.meta.env.VITE_BUILD_TIME}</p>
    </div>
  );
}
```

Access at: `https://glycogrit.com/health`

---

## Troubleshooting

### Build Failures

**Issue:** Build fails on Vercel but works locally

**Solutions:**
```bash
# 1. Check Node version matches
node -v  # Should match Vercel (20.x)

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Check for missing env variables
# Add them in Vercel Dashboard

# 4. Check build logs
vercel logs --filter="build"
```

### DNS Issues

**Issue:** Domain not resolving

**Solutions:**
```bash
# 1. Check DNS propagation
dig glycogrit.com

# 2. Flush DNS cache (local)
# macOS
sudo dscache util -flushcache

# 3. Verify records at Namecheap
# Ensure A record points to correct Vercel IP

# 4. Wait for propagation (up to 48 hours)
```

### Deployment Stuck

**Issue:** Deployment stuck in "Building" or "Queued"

**Solutions:**
1. Cancel deployment in Vercel Dashboard
2. Push a new commit to retry
3. Contact Vercel support if persists

### 404 Errors

**Issue:** Routes return 404 on refresh

**Solution:** Add `vercel.json` redirect rules:
```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

---

## Best Practices

### DO ✅
- Test on preview deployments before staging
- Always test on staging before production
- Use descriptive commit messages
- Monitor deployments after merge
- Keep staging in sync with master
- Document environment variables
- Use branch protection rules

### DON'T ❌
- Skip staging environment
- Merge without code review
- Force push to master or staging
- Deploy Friday afternoon (without good reason)
- Ignore build warnings
- Commit sensitive data
- Deploy untested code

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Environment variables configured
- [ ] Dependencies up to date
- [ ] Build succeeds locally
- [ ] Code reviewed and approved

### During Deployment
- [ ] PR created with clear description
- [ ] CI/CD checks passing
- [ ] Preview deployment tested
- [ ] Staging deployment tested
- [ ] Team notified of deployment

### Post-Deployment
- [ ] Production site accessible
- [ ] No errors in Vercel logs
- [ ] Core functionality tested
- [ ] Performance metrics reviewed
- [ ] Team notified of completion
- [ ] Staging branch updated

---

**Last Updated:** 2024-04-13
**Platform:** Vercel
**Domain:** glycogrit.com via Namecheap
