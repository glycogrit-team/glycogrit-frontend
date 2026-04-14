# Doppler Quick Start

This project uses **Doppler** for centralized secret management across all environments.

## Prerequisites

- Doppler account: https://doppler.com (free tier)
- Doppler CLI installed

## Installation

```bash
# macOS
brew install dopplerhq/cli/doppler

# Linux
curl -sLf https://cli.doppler.com/install.sh | sh

# Windows
scoop install doppler
```

## First Time Setup

```bash
# 1. Login to Doppler
doppler login

# 2. Navigate to project
cd glycogrit-frontend

# 3. Setup Doppler (will use doppler.yaml config)
doppler setup

# Follow prompts:
# Project: glycogrit-frontend
# Config: dev (for local development)
```

## Daily Usage

### Run development server with Doppler

```bash
# Option 1: Using npm script (recommended)
npm run dev:doppler

# Option 2: Direct command
doppler run -- npm run dev

# Option 3: Generate .env.local (less recommended - can become stale)
doppler secrets download --no-file --format env > .env.local
npm run dev
```

### View secrets

```bash
# List all secrets for current config
doppler secrets

# View specific secret
doppler secrets get VITE_API_BASE_URL
```

### Switch environments

```bash
# Development (default)
doppler setup --config dev

# Staging
doppler setup --config stg

# Production (read-only for most developers)
doppler setup --config prd
```

## Available npm Scripts

```bash
npm run dev              # Normal dev (uses .env.local if exists)
npm run dev:doppler      # Dev with Doppler secrets
npm run build:doppler    # Build with Doppler secrets
npm run doppler:setup    # Configure Doppler
npm run doppler:secrets  # View secrets
npm run doppler:open     # Open Doppler dashboard
```

## Environments

| Config | Environment | URL |
|--------|-------------|-----|
| `dev` | Local development | http://localhost:5173 |
| `stg` | Staging | staging.glycogrit.com |
| `prd` | Production | glycogrit.com |

## Getting Help

- **Full Documentation:** See [glycogrit-wiki/Doppler-Setup-Guide.md](../glycogrit-wiki/Doppler-Setup-Guide.md)
- **Doppler Docs:** https://docs.doppler.com
- **Team Questions:** Open GitHub issue

## Common Issues

### "Command not found: doppler"

```bash
# Reinstall Doppler CLI
brew reinstall dopplerhq/cli/doppler
```

### "Project not found"

```bash
# Re-run setup
doppler setup
```

### "Secrets not loading"

```bash
# Verify you're logged in
doppler configure get

# Check current config
doppler secrets
```

## Security

- ⚠️ **NEVER** commit `.env.local` or `.doppler.*.yaml` files
- ⚠️ **NEVER** share Doppler tokens in code or chat
- ✅ **ALWAYS** use `doppler run` for local development
- ✅ **ALWAYS** rotate secrets every 90 days

---

**Quick Commands Cheat Sheet**

```bash
doppler login                    # Login to Doppler
doppler setup                    # Initialize project
doppler secrets                  # View all secrets
doppler run -- npm run dev       # Run with secrets
doppler open                     # Open dashboard
doppler --help                   # Get help
```
