# Coding Standards & Conventions

This document outlines the coding standards and conventions used in the GlycoGrit project, inspired by professional patterns from the NOVA project.

## Table of Contents
- [TypeScript Standards](#typescript-standards)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Import Order](#import-order)
- [Component Patterns](#component-patterns)
- [Code Formatting](#code-formatting)
- [Comments & Documentation](#comments--documentation)

---

## TypeScript Standards

### Strict Mode
- **Always use TypeScript in strict mode**
- Enable all strict type-checking options in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    }
  }
  ```

### Type vs Interface

**Use `interface` for:**
- Object shapes that may be extended
- Component props
- API response types
- Public APIs

```typescript
// ✅ Good
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
}
```

**Use `type` for:**
- Union types
- Intersection types
- Mapped types
- Utility types

```typescript
// ✅ Good
type ChallengeCategory = 'running' | 'cycling' | 'walking' | 'mixed' | 'strength';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type AsyncState<T> = 'idle' | 'loading' | 'success' | 'error';
```

### Generics
- Use meaningful generic names, not just `T`
- Add constraints when applicable

```typescript
// ❌ Bad
function pick<T, K>(obj: T, keys: K[]): any {
  // ...
}

// ✅ Good
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  // ...
}
```

### Type Assertions
- Avoid `as any` - use `unknown` instead
- Prefer type guards over assertions
- Use `as const` for literal types

```typescript
// ❌ Bad
const data = response as any;

// ✅ Good
const data = response as unknown;
if (isValidResponse(data)) {
  // data is now properly typed
}

// ✅ Good - const assertion
const CATEGORIES = ['running', 'cycling', 'walking'] as const;
type Category = typeof CATEGORIES[number]; // 'running' | 'cycling' | 'walking'
```

---

## Naming Conventions

### Files

**Components:**
```
PascalCase.tsx
- ChallengeCard.tsx
- Button.tsx
- Navbar.tsx
```

**Utilities, Hooks, Lib:**
```
camelCase.ts
- format.ts
- useChallenges.ts
- api-client.ts (with hyphens for multi-word)
```

**Configuration:**
```
kebab-case or camelCase
- tailwind.config.js
- vite.config.js
- config.ts
```

### Variables & Functions

```typescript
// ✅ camelCase for variables and functions
const userCount = 10;
const isActive = true;
const getUserName = () => 'John';

// ✅ PascalCase for components and classes
const Button = () => <button />;
class ApiClient {}

// ✅ UPPER_SNAKE_CASE for constants
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';

// ✅ Private fields with underscore (in classes)
class UserService {
  private _cache: Map<string, User>;
}
```

### Boolean Variables
- Prefix with `is`, `has`, `should`, `can`

```typescript
// ✅ Good
const isLoading = false;
const hasError = false;
const shouldRender = true;
const canSubmit = false;

// ❌ Bad
const loading = false;
const error = false;
```

### Event Handlers
- Prefix with `handle` or `on`

```typescript
// ✅ Good - Component
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = (e: ChangeEvent) => {};

// ✅ Good - Props
interface ButtonProps {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
}
```

### React Hooks
- Always prefix with `use`

```typescript
// ✅ Good
function useChallenges() {}
function useDebounce<T>(value: T, delay: number) {}
function useLocalStorage(key: string) {}
```

---

## File Organization

### Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Generic reusable (Button, Card, Badge)
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── features/       # Feature-specific (ChallengeCard)
├── pages/              # Route-level components
├── lib/                # Core library code
│   ├── config.ts       # Configuration classes
│   ├── api-client.ts   # API client
│   └── errors.ts       # Error classes
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
├── constants/          # Constants and mock data
└── assets/             # Static assets
```

### Component File Structure

```typescript
// 1. Imports (ordered)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeConfig } from '@/lib/config';
import Button from '@/components/common/Button';
import type { Challenge } from '@/types/challenge';

// 2. Types/Interfaces
interface ChallengeCardProps {
  challenge: Challenge;
  onSelect?: (id: string) => void;
}

// 3. Constants (if any)
const MAX_DESCRIPTION_LENGTH = 100;

// 4. Helper functions (if any)
function truncateDescription(text: string): string {
  // ...
}

// 5. Main component
export default function ChallengeCard({ challenge, onSelect }: ChallengeCardProps) {
  // Hooks first
  const [isExpanded, setIsExpanded] = useState(false);

  // Then derived values
  const description = truncateDescription(challenge.description);

  // Then event handlers
  const handleClick = () => {
    onSelect?.(challenge.id);
  };

  // Then render
  return (
    // JSX
  );
}

// 6. Sub-components (if needed)
function ChallengeStats({ participants }: { participants: number }) {
  return <span>{participants} joined</span>;
}
```

---

## Import Order

Following NOVA's Prettier configuration:

```typescript
// 1. CSS/Style imports
import './styles.css';

// 2. React imports
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 3. Next.js imports (if using Next.js)
import { useRouter } from 'next/router';
import Image from 'next/image';

// 4. Third-party libraries
import { clsx } from 'clsx';
import { toast } from 'sonner';

// 5. Type imports
import type { Challenge } from '@/types/challenge';

// 6. Config imports
import { ChallengeConfig } from '@/lib/config';

// 7. Lib imports
import { apiClient } from '@/lib/api-client';

// 8. Hook imports
import { useChallenges } from '@/hooks/useChallenges';

// 9. UI component imports
import { Button } from '@/components/ui/button';

// 10. Feature component imports
import ChallengeCard from '@/components/features/ChallengeCard';

// 11. Relative imports
import { helper } from './helpers';
```

**Prettier Config:**
```javascript
module.exports = {
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: 'none',
  importOrder: [
    '^.+\\.css$',
    '^(react/(.*)$)|^(react$)',
    '<THIRD_PARTY_MODULES>',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/(.*)$',
    '^[./]'
  ]
}
```

---

## Component Patterns

### Functional Components
- **Always use functional components with hooks**
- Use arrow functions for inline components
- Use function declarations for exported components

```typescript
// ✅ Good - Exported component
export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return <div>{challenge.title}</div>;
}

// ✅ Good - Inline component
const renderHeader = () => <header>Title</header>;

// ❌ Bad - Class components (avoid unless necessary)
class ChallengeCard extends React.Component {
  render() {
    return <div />;
  }
}
```

### Props Pattern

```typescript
// ✅ Good - Destructure props
function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Bad - Don't use props object directly
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Children Pattern

```typescript
interface CardProps {
  children: ReactNode;
  title?: string;
}

// ✅ Good - ReactNode for children
function Card({ children, title }: CardProps) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
```

### Conditional Rendering

```typescript
// ✅ Good - Use && for simple conditions
{isLoading && <Spinner />}

// ✅ Good - Use ternary for if/else
{isLoading ? <Spinner /> : <Content />}

// ✅ Good - Use early returns for complex logic
if (!data) {
  return <EmptyState />;
}

return <DataView data={data} />;
```

### Component Composition

```typescript
// ✅ Good - Composition over props drilling
<Card>
  <Card.Header>
    <Card.Title>Challenge</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Details here</p>
  </Card.Content>
</Card>

// ✅ Good - Render props for flexibility
<DataFetcher
  url="/api/challenges"
  render={(data) => <ChallengeList challenges={data} />}
/>
```

### Custom Hooks Pattern

```typescript
// ✅ Good - Return object with named properties
function useChallenges(options?: UseChallengesOptions) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... logic

  return {
    challenges,
    loading,
    error,
    refetch
  };
}

// Usage
const { challenges, loading, error, refetch } = useChallenges();
```

---

## Code Formatting

### Prettier Configuration

```javascript
// prettier.config.cjs
module.exports = {
  endOfLine: 'lf',
  semi: false,                    // No semicolons
  useTabs: false,                 // Use spaces
  singleQuote: false,             // Use double quotes
  arrowParens: 'avoid',           // Avoid parens when possible
  tabWidth: 2,                    // 2 spaces
  trailingComma: 'none',          // No trailing commas
  printWidth: 100                 // Max line length
}
```

### Line Length
- **Maximum 100 characters per line**
- Break long lines appropriately

```typescript
// ✅ Good
const challenge = challenges.find(
  (c) => c.id === id && c.category === 'running'
);

// ❌ Bad - Too long
const challenge = challenges.find((c) => c.id === id && c.category === 'running' && c.difficulty === 'beginner');
```

### Spacing

```typescript
// ✅ Good - Space after keywords
if (condition) {
  // ...
}

for (const item of items) {
  // ...
}

// ✅ Good - Space around operators
const sum = a + b;
const isValid = count > 0 && count < 100;

// ✅ Good - No space in function calls
const result = calculate(a, b);

// ✅ Good - Space in object literals
const config = { api: 'url', timeout: 3000 };
```

---

## Comments & Documentation

### JSDoc Comments

```typescript
/**
 * Fetch challenges from the API with optional filters
 *
 * @param options - Filter options for challenges
 * @param options.category - Category to filter by
 * @param options.difficulty - Difficulty level to filter by
 * @returns Promise resolving to array of challenges
 * @throws {APIError} When the API request fails
 *
 * @example
 * ```typescript
 * const challenges = await getChallenges({
 *   category: 'running',
 *   difficulty: 'beginner'
 * });
 * ```
 */
async function getChallenges(options?: GetChallengesOptions): Promise<Challenge[]> {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Calculate with exponential backoff to avoid rate limiting
const delay = baseDelay * Math.pow(2, attempt);

// ❌ Bad - States the obvious
// Add 1 to count
count = count + 1;

// ✅ Good - Complex logic explanation
// Transform API response to match our internal format.
// Backend returns snake_case, we use camelCase
const challenge = transformResponse(response);
```

### TODO Comments

```typescript
// ✅ Good format
// TODO(username): Add pagination support
// FIXME(username): Memory leak in WebSocket connection
// NOTE: This is a temporary workaround until backend fixes the API
```

### File Headers

```typescript
/**
 * Challenge API Client
 *
 * Handles all API calls related to challenges including fetching,
 * creating, updating, and deleting challenges.
 *
 * @module lib/challenge-api
 */
```

---

## Best Practices Summary

### DO ✅
- Use TypeScript strict mode
- Use meaningful variable names
- Keep functions small and focused
- Use early returns to avoid nested conditions
- Destructure props and objects
- Use const by default, let when reassignment needed
- Add JSDoc for public APIs
- Follow the import order
- Use path aliases (@/ imports)
- Keep components under 200 lines (split if larger)

### DON'T ❌
- Use `any` type (use `unknown` instead)
- Use `var` (use `const` or `let`)
- Mutate props or state directly
- Use inline styles (use Tailwind classes)
- Create deeply nested components
- Use magic numbers (create named constants)
- Leave console.logs in production code
- Use `// @ts-ignore` (fix the type issue)
- Mix concerns in a single file
- Create god components/functions

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] TypeScript compiles without errors
- [ ] No unused imports or variables
- [ ] Proper typing (no `any` unless justified)
- [ ] Consistent naming conventions
- [ ] Proper import order
- [ ] Components are properly structured
- [ ] Error handling is in place
- [ ] Comments explain complex logic
- [ ] No console.logs or debug code
- [ ] Follows the established patterns

---

## Tools & Automation

### Required Tools
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Recommended IDE Setup
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Scripts
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\""
  }
}
```

---

**Last Updated:** 2024-04-13
**Based on:** NOVA Project Standards & Industry Best Practices
