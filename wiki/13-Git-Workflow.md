# Git Workflow

Git workflow and branching strategy for GlycoGrit.

## Branching Strategy

```
master (production)
  ↑
staging (pre-production)
  ↑
feature/xyz (development)
```

## Branch Types

### Protected Branches
- **master** - Production code
- **staging** - Integration branch

### Feature Branches
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Emergency production fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation

## Workflow

### Starting New Feature
```bash
git checkout staging
git pull origin staging
git checkout -b feature/challenge-filters
```

### Committing Changes
```bash
git add .
git commit -m "Add challenge filter functionality

- Implement category and difficulty filters
- Add filter state management
- Update UI with filter controls

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Creating Pull Request
```bash
git push -u origin feature/challenge-filters
gh pr create --base staging --title "Add challenge filters"
```

### Merging to Production
```bash
# After staging testing
gh pr create --base master --title "Release: Challenge filters"
# Get approval and merge
```

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Examples
```
feat: Add user authentication

Implement JWT-based authentication with httpOnly cookies.
Includes login, logout, and protected route functionality.

🤖 Generated with Claude Code
```

## Best Practices

1. **Keep commits atomic** - One logical change per commit
2. **Write descriptive messages** - Explain why, not what
3. **Pull before push** - Always sync with remote first
4. **Review your diff** - Check changes before committing
5. **Test locally** - Ensure code works before pushing

**Last Updated:** 2024-04-13
