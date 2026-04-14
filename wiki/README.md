# GlycoGrit Frontend Wiki

Welcome to the GlycoGrit Frontend documentation! This wiki serves as the central knowledge base for developers working on the project.

## 📚 Documentation Index

### Getting Started
1. [Project Structure](./02-Project-Structure.md) - Folder organization and architecture
2. [Coding Standards](./01-Coding-Standards.md) - TypeScript, React, and formatting conventions
3. [Design Patterns](./05-Design-Patterns.md) - Architectural patterns and best practices

### Development
4. [Component Guidelines](./06-Component-Guidelines.md) - How to build and structure components
5. [State Management](./07-State-Management.md) - Hooks, Context, and state patterns
6. [Styling Guide](./08-Styling-Guide.md) - Tailwind CSS usage and theming

### Deployment & Operations
7. [Deployment Guide](./03-Deployment-Guide.md) - Vercel setup, DNS, and CI/CD
8. [Environment Configuration](./09-Environment-Setup.md) - Local development and env variables
9. [Monitoring & Debugging](./10-Monitoring.md) - Logs, analytics, and troubleshooting

### Security & Quality
10. [Security Best Practices](./04-Security-Best-Practices.md) - XSS, CSRF, auth, and more
11. [Testing Strategy](./11-Testing.md) - Unit, integration, and E2E testing
12. [Performance Optimization](./12-Performance.md) - Code splitting, lazy loading, and caching

### Contributing
13. [Git Workflow](./13-Git-Workflow.md) - Branching, committing, and PRs
14. [Code Review Guide](./14-Code-Review.md) - What to look for in reviews
15. [Troubleshooting](./15-Troubleshooting.md) - Common issues and solutions

---

## 🚀 Quick Start

### For New Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/glycogrit-team/glycogrit-frontend.git
   cd glycogrit-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Read the docs**
   - [Project Structure](./02-Project-Structure.md)
   - [Coding Standards](./01-Coding-Standards.md)
   - [Component Guidelines](./06-Component-Guidelines.md)

### For Existing Developers

**Daily Workflow:**
1. Pull latest changes: `git pull origin staging`
2. Create feature branch: `git checkout -b feature/my-feature`
3. Develop and commit following [conventions](./01-Coding-Standards.md)
4. Push and create PR to `staging`
5. Address code review feedback
6. Merge after approval

**Before Deploying:**
- [ ] All tests passing
- [ ] TypeScript compiles without errors
- [ ] Code reviewed and approved
- [ ] Tested on preview deployment
- [ ] Documentation updated if needed

---

## 📖 Core Documentation

### [01. Coding Standards](./01-Coding-Standards.md)
Learn about TypeScript patterns, naming conventions, component structure, and code formatting.

**Key Topics:**
- TypeScript strict mode and type patterns
- Naming conventions for files, variables, functions
- Component patterns and hooks
- Import order and file organization
- Code review checklist

### [02. Project Structure](./02-Project-Structure.md)
Understand the folder structure and how code is organized.

**Key Topics:**
- Folder hierarchy and purpose
- Common vs feature components
- Pages, hooks, utils, and lib organization
- Path aliases and barrel exports
- Co-location strategies

### [03. Deployment Guide](./03-Deployment-Guide.md)
Everything about deploying to production and managing environments.

**Key Topics:**
- Vercel setup and configuration
- Environment management (dev, staging, prod)
- DNS and domain configuration
- CI/CD workflow
- Rollback procedures
- Monitoring and debugging

### [04. Security Best Practices](./04-Security-Best-Practices.md)
Critical security guidelines to protect users and data.

**Key Topics:**
- Authentication and authorization
- XSS and CSRF prevention
- API security
- Secrets management
- Content Security Policy
- Security headers

### [05. Design Patterns](./05-Design-Patterns.md)
Architectural patterns used throughout the codebase.

**Key Topics:**
- Singleton pattern (API clients)
- Configuration classes
- Custom hooks patterns
- Context providers
- Error handling patterns
- Component composition

---

## 🛠️ Development Tools

### Required Tools
- **Node.js** 20.x or later
- **npm** or **yarn** or **pnpm**
- **Git** 2.x or later
- **VS Code** (recommended IDE)

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

### Available Scripts

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run type-check    # TypeScript type checking
npm run format        # Format with Prettier
npm run format:check  # Check formatting

# Git Hooks
npm run prepare       # Setup git hooks (husky)
```

---

## 🎯 Architecture Overview

### Technology Stack

**Frontend:**
- React 18.2 - UI library
- TypeScript 5.3 - Type safety
- Vite 5.2 - Build tool
- React Router 6.21 - Client-side routing

**Styling:**
- Tailwind CSS 3.4 - Utility-first CSS
- CSS Variables - Theming support

**State Management:**
- React Context - Global state
- Custom Hooks - Reusable logic

**API Layer:**
- Class-based API client
- Fetch API with TypeScript
- Centralized error handling

### Key Architectural Decisions

1. **Function Components over Class Components**
   - Modern React patterns
   - Hooks for state and effects
   - Better performance

2. **TypeScript Strict Mode**
   - Catch errors at compile time
   - Better IDE support
   - Self-documenting code

3. **Configuration Classes**
   - Single source of truth
   - Type-safe configuration
   - Easy to modify

4. **Custom Hooks for Business Logic**
   - Reusable across components
   - Testable in isolation
   - Clean component code

5. **Path Aliases**
   - Cleaner imports
   - Easier refactoring
   - Better organization

---

## 📝 Contributing Guidelines

### Before You Start
1. Read [Coding Standards](./01-Coding-Standards.md)
2. Understand [Project Structure](./02-Project-Structure.md)
3. Review [Git Workflow](./13-Git-Workflow.md)

### Making Changes
1. Create a feature branch from `staging`
2. Make your changes following coding standards
3. Write/update tests
4. Update documentation if needed
5. Run linters and type checks
6. Create a PR with clear description

### Code Review
- All PRs require at least 1 approval
- Address all review comments
- Keep PRs focused and small (<400 lines)
- Write descriptive commit messages

### Documentation
- Update wiki pages when adding features
- Add JSDoc comments for public APIs
- Include examples in complex functions
- Keep README.md up to date

---

## 🔍 Finding Information

### How to Use This Wiki

**I want to...**
- **Learn the project structure** → [Project Structure](./02-Project-Structure.md)
- **Understand coding standards** → [Coding Standards](./01-Coding-Standards.md)
- **Build a component** → [Component Guidelines](./06-Component-Guidelines.md)
- **Deploy to production** → [Deployment Guide](./03-Deployment-Guide.md)
- **Fix a security issue** → [Security Practices](./04-Security-Best-Practices.md)
- **Optimize performance** → [Performance Guide](./12-Performance.md)
- **Write tests** → [Testing Strategy](./11-Testing.md)
- **Debug an issue** → [Troubleshooting](./15-Troubleshooting.md)

### Search Tips
- Use your IDE's search (Cmd/Ctrl + Shift + F)
- Search in GitHub repository
- Check ARCHITECTURE.md for design patterns
- Review code examples in wiki pages

---

## 🤝 Getting Help

### Resources
- **Wiki**: You're here!
- **ARCHITECTURE.md**: Detailed architecture documentation
- **DEPLOYMENT.md**: Deployment workflow
- **Code Comments**: JSDoc comments in source code

### Team Communication
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code discussions
- **Slack/Discord**: Quick questions (if applicable)
- **Team Meetings**: Architecture decisions

### Common Questions

**Q: How do I add a new page?**
A: See [Component Guidelines](./06-Component-Guidelines.md#pages)

**Q: How do I fetch data from API?**
A: See [Design Patterns](./05-Design-Patterns.md#api-client-pattern)

**Q: How do I deploy to staging?**
A: See [Deployment Guide](./03-Deployment-Guide.md#deployment-workflow)

**Q: How do I fix TypeScript errors?**
A: See [Troubleshooting](./15-Troubleshooting.md#typescript-errors)

---

## 📊 Project Statistics

**Last Updated:** 2024-04-13

**Codebase:**
- React Components: 15+
- Custom Hooks: 6
- Utility Functions: 30+
- Configuration Classes: 4
- Type Definitions: 10+

**Dependencies:**
- Total: 25
- Direct: 10
- Dev: 15

**Test Coverage:** (To be added)
- Unit Tests: TBD
- Integration Tests: TBD
- E2E Tests: TBD

---

## 🔄 Keeping This Wiki Updated

This wiki is a living document. When making significant changes to the codebase:

1. **Update relevant wiki pages**
2. **Add new pages if needed**
3. **Update code examples**
4. **Keep the index current**
5. **Verify links still work**

**Wiki Maintainers:**
- Review PRs that affect documentation
- Ensure wiki stays synchronized with code
- Archive outdated information

---

## 📜 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

This architecture was inspired by:
- **NOVA Project** - Professional Next.js patterns
- **React Documentation** - Best practices
- **Vercel** - Deployment platform
- **Tailwind CSS** - Styling approach

---

**Questions or Suggestions?**
Open an issue or submit a PR to improve this documentation!

**Last Updated:** April 13, 2024
