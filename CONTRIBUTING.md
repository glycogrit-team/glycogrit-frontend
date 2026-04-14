# Contributing to GlycoGrit

Thank you for your interest in contributing to GlycoGrit! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later
- **npm** 9.x or later (or **yarn** 1.22.x / **pnpm** 8.x)
- **Git** 2.x or later
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/glycogrit-frontend.git
cd glycogrit-frontend
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/glycogrit-team/glycogrit-frontend.git
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Development Workflow

### Branch Strategy

We follow a **Git Flow** inspired branching model:

```
master (production)
├── staging (pre-production)
    ├── feature/your-feature-name
    ├── bugfix/issue-description
    └── hotfix/critical-fix
```

### Creating a New Branch

1. **Always branch from `staging`**:

```bash
git checkout staging
git pull upstream staging
git checkout -b feature/your-feature-name
```

2. **Branch naming conventions**:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-challenge-filters` |
| Bug Fix | `bugfix/issue-number-description` | `bugfix/123-fix-login-error` |
| Hotfix | `hotfix/description` | `hotfix/security-vulnerability` |
| Docs | `docs/description` | `docs/update-readme` |
| Refactor | `refactor/description` | `refactor/api-client-error-handling` |

### Daily Workflow

```bash
# 1. Start your day by updating your branch
git checkout staging
git pull upstream staging
git checkout your-branch
git rebase staging

# 2. Make your changes
# ... code, code, code ...

# 3. Check your changes
git status
git diff

# 4. Stage and commit
git add .
git commit -m "feat: add challenge filter component"

# 5. Push to your fork
git push origin your-branch
```

---

## Coding Standards

We follow strict coding standards inspired by the NOVA project. Full details are in [wiki/01-Coding-Standards.md](wiki/01-Coding-Standards.md).

### Key Principles

1. **TypeScript Strict Mode**: All code must pass `tsc --noEmit` with zero errors
2. **ESLint**: Code must pass linting with `npm run lint`
3. **Prettier**: Code must be formatted with `npm run format`
4. **No `any` types**: Use specific types or `unknown`

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `ChallengeCard.tsx` |
| Hook | camelCase + `use` prefix | `useChallenges.ts` |
| Utility | camelCase | `formatDate.ts` |
| Type | PascalCase | `Challenge.ts` |
| Config | camelCase + `Config` suffix | `apiConfig.ts` |

### Component Structure

```typescript
// 1. Imports (ordered: CSS → React → Third-party → Internal)
import './ChallengeCard.css';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Challenge } from '@/types';
import { formatDate } from '@/utils';

// 2. Types/Interfaces
interface ChallengeCardProps {
  challenge: Challenge;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

// 3. Component
export function ChallengeCard({
  challenge,
  onSelect,
  isSelected = false
}: ChallengeCardProps) {
  // Hooks at the top
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Event handlers with 'handle' prefix
  const handleClick = useCallback(() => {
    onSelect?.(challenge.id);
  }, [challenge.id, onSelect]);

  // Render
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("card", isSelected && "selected")}
    >
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
    </div>
  );
}
```

### Code Review Checklist

Before submitting your PR, ensure:

- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] ESLint passes with no warnings (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] All tests pass (`npm run test`)
- [ ] No `console.log` statements remain
- [ ] No secrets or API keys in code
- [ ] Components follow naming conventions
- [ ] Functions have clear, descriptive names
- [ ] Complex logic has comments explaining "why"
- [ ] New features have tests

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(challenges): add filter by difficulty` |
| `fix` | Bug fix | `fix(auth): resolve token expiry issue` |
| `docs` | Documentation only | `docs(readme): update installation steps` |
| `style` | Code style (formatting, missing semi-colons) | `style(button): fix indentation` |
| `refactor` | Code refactoring | `refactor(api): simplify error handling` |
| `perf` | Performance improvement | `perf(list): optimize rendering with memo` |
| `test` | Adding or updating tests | `test(challenges): add unit tests for filters` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `ci` | CI/CD changes | `ci(vercel): add deployment config` |

### Commit Examples

```bash
# Feature
git commit -m "feat(challenges): add search functionality"

# Bug fix with issue number
git commit -m "fix(login): resolve OAuth redirect issue

Fixes #123"

# Breaking change
git commit -m "feat(api)!: change authentication endpoint

BREAKING CHANGE: Auth endpoint changed from /login to /auth/login"

# Multiple changes
git commit -m "feat(challenges): add filters and sorting

- Add difficulty filter
- Add category filter
- Implement sort by date
- Add sort by popularity"
```

### Commit Best Practices

✅ **Do:**
- Write commits in present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject line with a period
- Use body to explain "what" and "why" vs. "how"
- Reference issues/PRs in footer

❌ **Don't:**
- Commit directly to `master` or `staging`
- Make commits with failing tests
- Include unrelated changes in one commit
- Use vague messages like "fix stuff" or "updates"

---

## Pull Request Process

### Before Creating a PR

1. **Rebase on latest `staging`**:

```bash
git checkout staging
git pull upstream staging
git checkout your-branch
git rebase staging
```

2. **Run all checks**:

```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run test        # Tests
npm run build       # Production build
```

3. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch**:

```bash
git push origin your-branch
```

2. **Open PR on GitHub**:
   - Base: `staging`
   - Compare: `your-branch`

3. **PR Title**: Use conventional commits format

```
feat(challenges): add filter by difficulty
```

4. **PR Description**: Use this template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the coding standards of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Related Issues
Fixes #123
Relates to #456
```

### PR Review Process

1. **Automated Checks**: All checks must pass
   - TypeScript compilation
   - ESLint
   - Tests
   - Build

2. **Code Review**: At least 1 approval required
   - Reviewers may request changes
   - Address all comments

3. **Address Feedback**:

```bash
# Make changes based on feedback
git add .
git commit -m "fix: address PR feedback"
git push origin your-branch
```

4. **Merge**: Once approved, a maintainer will merge your PR

### After Your PR is Merged

```bash
# Update your local staging branch
git checkout staging
git pull upstream staging

# Delete your feature branch
git branch -d your-branch
git push origin --delete your-branch
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Tests should be co-located with the code they test:

```
components/
├── ChallengeCard/
│   ├── ChallengeCard.tsx
│   └── ChallengeCard.test.tsx
```

Example test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChallengeCard } from './ChallengeCard';

describe('ChallengeCard', () => {
  const mockChallenge = {
    id: '1',
    title: 'Test Challenge',
    description: 'Test description'
  };

  it('renders challenge title', () => {
    render(<ChallengeCard challenge={mockChallenge} />);
    expect(screen.getByText('Test Challenge')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<ChallengeCard challenge={mockChallenge} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Test Challenge'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing behavior
- Add new configuration options
- Introduce breaking changes
- Fix a significant bug

### Documentation Locations

| Type | Location |
|------|----------|
| **Technical docs** | `/wiki/*.md` (in-repository) |
| **Process docs** | GitHub Wiki |
| **API docs** | JSDoc comments in code |
| **Architecture** | `ARCHITECTURE.md` |
| **Contributing** | This file |

### Writing Good Documentation

✅ **Do:**
- Use clear, concise language
- Provide examples
- Keep documentation up-to-date
- Include code snippets
- Add screenshots for UI changes

❌ **Don't:**
- Assume knowledge
- Use jargon without explanation
- Leave outdated information
- Forget to update examples

---

## Getting Help

### Resources

- **Wiki**: [In-repo documentation](wiki/README.md)
- **GitHub Wiki**: [Process documentation](https://github.com/glycogrit-team/glycogrit-frontend/wiki)
- **Issues**: [Report bugs or request features](https://github.com/glycogrit-team/glycogrit-frontend/issues)
- **Discussions**: [Ask questions](https://github.com/glycogrit-team/glycogrit-frontend/discussions)

### Common Questions

**Q: How do I run the project locally?**
A: See [Getting Started](#getting-started) section above.

**Q: What branch should I base my work on?**
A: Always branch from `staging`, never `master`.

**Q: How do I fix merge conflicts?**
A: Rebase your branch on latest `staging` and resolve conflicts locally.

**Q: My PR checks are failing, what do I do?**
A: Run the checks locally (`npm run type-check`, `npm run lint`, `npm run test`) and fix the issues.

---

## License

By contributing to GlycoGrit, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing to GlycoGrit!** 🎉

Your contributions help make this project better for everyone.

---

**Last Updated**: April 14, 2024
