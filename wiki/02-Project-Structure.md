# Project Structure & Organization

This document describes the folder structure, file organization, and architectural patterns used in the GlycoGrit project.

## Table of Contents
- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Directory Descriptions](#directory-descriptions)
- [File Naming Conventions](#file-naming-conventions)
- [Module Organization](#module-organization)
- [Barrel Exports](#barrel-exports)
- [Path Aliases](#path-aliases)

---

## Overview

GlycoGrit follows a **feature-based architecture** with clear separation of concerns. The project is organized to maximize:
- **Scalability** - Easy to add new features
- **Maintainability** - Easy to find and modify code
- **Reusability** - Shared components and utilities
- **Type Safety** - Strong TypeScript typing throughout

**Tech Stack:**
- **Framework:** React 18 with Vite
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 6.21
- **State:** React Context + Custom Hooks

---

## Folder Structure

```
glycogrit-frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── components/           # React components
│   │   ├── common/          # Generic reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── features/        # Feature-specific components
│   │       ├── ChallengeCard.tsx
│   │       ├── ChallengeFilters.tsx
│   │       └── UserProfile.tsx
│   │
│   ├── pages/               # Route-level page components
│   │   ├── Home.tsx
│   │   ├── Challenges.tsx
│   │   ├── ChallengeDetail.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   │
│   ├── lib/                 # Core library code
│   │   ├── config.ts       # Configuration classes
│   │   ├── api-client.ts   # API client singleton
│   │   └── errors.ts       # Custom error classes
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useChallenges.ts
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── format.ts       # Formatting utilities
│   │   ├── validation.ts   # Validation functions
│   │   └── helpers.ts      # General helpers
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── challenge.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts        # Barrel export
│   │
│   ├── constants/           # Application constants
│   │   ├── challenges.ts   # Mock challenge data
│   │   ├── routes.ts       # Route constants
│   │   └── config.ts       # App-wide constants
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── assets/              # Static assets (imported in code)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── styles/              # Global styles
│   │   └── globals.css
│   │
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite type declarations
│
├── wiki/                    # Project documentation
│   ├── 01-Coding-Standards.md
│   ├── 02-Project-Structure.md
│   ├── 03-Deployment.md
│   └── ...
│
├── .gitignore
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── ARCHITECTURE.md
├── DEPLOYMENT.md
└── README.md
```

---

## Directory Descriptions

### `/src/components/`
React components organized by purpose.

#### `/components/common/`
**Purpose:** Generic, reusable UI components
**Examples:** Button, Card, Badge, Input, Modal
**Pattern:** Highly reusable, no business logic

```typescript
// ✅ Good - Generic, reusable
<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

// ✅ Good - Accepts any children
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content here</Card.Content>
</Card>
```

**Guidelines:**
- Should be app-agnostic (could be used in any project)
- Accept generic props (children, className, etc.)
- Minimal to no dependencies on other app code
- Focus on presentation, not business logic

#### `/components/layout/`
**Purpose:** Layout and structural components
**Examples:** Navbar, Footer, Sidebar, Container
**Pattern:** App-specific layouts, may use common components

```typescript
// Navbar.tsx - Layout component
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <Container>
        <Link to="/">GlycoGrit</Link>
        <Button>Login</Button>
      </Container>
    </nav>
  );
}
```

**Guidelines:**
- Define the overall structure of pages
- Can use routing and navigation
- May contain app-specific logic
- Should be reused across multiple pages

#### `/components/features/`
**Purpose:** Feature-specific components
**Examples:** ChallengeCard, ChallengeFilters, UserProfile
**Pattern:** Business logic, uses common components

```typescript
// ChallengeCard.tsx - Feature component
export default function ChallengeCard({ challenge }: Props) {
  const { joinChallenge, loading } = useChallengeActions();

  return (
    <Card>
      <Badge variant={ChallengeConfig.getDifficultyColor(challenge.difficulty)}>
        {challenge.difficulty}
      </Badge>
      <Button onClick={() => joinChallenge(challenge.id)}>
        Join Challenge
      </Button>
    </Card>
  );
}
```

**Guidelines:**
- Contain business logic and feature-specific behavior
- Use hooks for data fetching and state management
- Compose common components
- May be specific to certain pages/features

### `/src/pages/`
**Purpose:** Top-level route components
**Pattern:** Compose layout + feature components

```typescript
// Challenges.tsx - Page component
export default function Challenges() {
  const { challenges, loading } = useChallenges();

  return (
    <div>
      <Navbar />
      <ChallengeFilters />
      <div className="grid grid-cols-3 gap-4">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
```

**Guidelines:**
- One page per route
- Compose layout and feature components
- Handle page-level state and data fetching
- Should not contain complex business logic (move to hooks/components)

### `/src/lib/`
**Purpose:** Core library code and business logic
**Examples:** API clients, configuration, error handling
**Pattern:** Class-based singletons and utilities

**Key Files:**
- `config.ts` - Static configuration classes
- `api-client.ts` - API client singleton
- `errors.ts` - Custom error classes

```typescript
// config.ts
export class AppConfig {
  static readonly API_URL = import.meta.env.VITE_API_URL;
  static readonly TIMEOUT = 30000;
}

// api-client.ts
export class APIClient {
  async getChallenges(): Promise<Challenge[]> {
    // ...
  }
}
export const apiClient = new APIClient();
```

**Guidelines:**
- No React dependencies (pure TypeScript)
- Focused, single-responsibility modules
- Exportable and testable
- Used by hooks and components

### `/src/hooks/`
**Purpose:** Custom React hooks
**Pattern:** Encapsulate reusable stateful logic

**Types of hooks:**
1. **Data hooks** - Fetch and manage data (`useChallenges`, `useAuth`)
2. **UI hooks** - UI-related logic (`useMediaQuery`, `useDebounce`)
3. **Utility hooks** - General utilities (`useLocalStorage`, `useToggle`)

```typescript
// useChallenges.ts
export function useChallenges(options?: Options) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logic
  }, [options]);

  return { challenges, loading, error, refetch };
}
```

**Guidelines:**
- Always prefix with `use`
- Return objects, not arrays (for clarity)
- Handle loading and error states
- Make reusable across components

### `/src/utils/`
**Purpose:** Pure utility functions
**Pattern:** Stateless, side-effect free functions

**Organization:**
- `format.ts` - Formatting functions (dates, numbers, etc.)
- `validation.ts` - Validation functions
- `helpers.ts` - General helper functions

```typescript
// format.ts
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

**Guidelines:**
- Pure functions only (no side effects)
- No React dependencies
- Fully testable in isolation
- Export named functions, not default

### `/src/types/`
**Purpose:** TypeScript type definitions
**Pattern:** Centralized type definitions

```typescript
// challenge.ts
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  category: ChallengeCategory;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeCategory = 'running' | 'cycling' | 'walking';
```

**Guidelines:**
- One file per domain/feature
- Use barrel exports (`index.ts`)
- Export both interfaces and types
- Keep types co-located with usage when appropriate

### `/src/constants/`
**Purpose:** Application-wide constants
**Pattern:** Read-only values and mock data

```typescript
// challenges.ts - Mock data
export const challenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Running Challenge',
    // ...
  }
];

// routes.ts - Route constants
export const ROUTES = {
  HOME: '/',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: '/challenges/:id'
} as const;
```

**Guidelines:**
- Use `as const` for immutability
- Group related constants
- Use UPPER_SNAKE_CASE for primitives
- Use camelCase for objects/arrays

---

## File Naming Conventions

### Components
```
PascalCase.tsx
✅ ChallengeCard.tsx
✅ Button.tsx
✅ UserProfile.tsx
```

### Hooks
```
camelCase.ts (with 'use' prefix)
✅ useChallenges.ts
✅ useAuth.ts
✅ useDebounce.ts
```

### Utilities & Lib
```
kebab-case.ts or camelCase.ts
✅ api-client.ts
✅ format.ts
✅ validation.ts
```

### Types
```
camelCase.ts (singular domain name)
✅ challenge.ts
✅ user.ts
✅ api.ts
```

### Configuration
```
kebab-case.js/ts
✅ vite.config.js
✅ tailwind.config.js
✅ postcss.config.js
```

---

## Module Organization

### Single Responsibility
Each file should have one primary purpose:

```typescript
// ✅ Good - Focused on challenge API calls
// api/challenge-api.ts
export async function getChallenges() {}
export async function getChallenge(id: string) {}
export async function joinChallenge(id: string) {}

// ❌ Bad - Mixed concerns
// api.ts
export async function getChallenges() {}
export async function getUser() {}
export async function uploadFile() {}
```

### Cohesion
Group related functionality:

```
// ✅ Good - Grouped by feature
hooks/
  ├── useChallenges.ts       # Challenge data
  ├── useChallengeActions.ts # Challenge actions
  └── useChallengeFilters.ts # Challenge filters

// ❌ Bad - Not grouped
hooks/
  ├── useFetch.ts
  ├── useData.ts
  ├── useActions.ts
```

---

## Barrel Exports

Use `index.ts` files to create clean import paths:

```typescript
// types/index.ts - Barrel export
export * from './challenge';
export * from './user';
export * from './api';

// Usage
import { Challenge, User, APIResponse } from '@/types';
```

**When to use barrel exports:**
- ✅ In `types/` directory
- ✅ For large feature modules
- ✅ For component libraries

**When NOT to use:**
- ❌ Small directories (2-3 files)
- ❌ Can impact tree-shaking
- ❌ Makes debugging harder

---

## Path Aliases

Configured in `vite.config.js`:

```javascript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types')
    }
  }
});
```

**Usage:**
```typescript
// ✅ Good - Clean with alias
import { Button } from '@/components/common/Button';
import { apiClient } from '@/lib/api-client';
import { useChallenges } from '@/hooks/useChallenges';

// ❌ Bad - Relative paths
import { Button } from '../../../components/common/Button';
import { apiClient } from '../../lib/api-client';
```

**Benefits:**
- Cleaner imports
- Easy refactoring
- No relative path confusion
- Better IDE autocomplete

---

## Component Co-location

Keep related files together:

```
components/features/ChallengeCard/
  ├── ChallengeCard.tsx      # Main component
  ├── ChallengeCard.test.tsx # Tests
  ├── ChallengeCard.css      # Styles (if not using Tailwind)
  ├── types.ts               # Component-specific types
  └── index.ts               # Barrel export
```

**When to co-locate:**
- Component has multiple related files
- Component is complex (>200 lines)
- Component has sub-components
- Component has specific types/utilities

**When NOT to co-locate:**
- Simple components (<100 lines)
- No related files
- Widely reused types

---

## Best Practices

### DO ✅
- Follow the established folder structure
- Use path aliases for cleaner imports
- Keep files focused and small (<300 lines)
- Group related functionality
- Use barrel exports for types
- Co-locate complex components
- Name files consistently

### DON'T ❌
- Create deeply nested folders (max 3 levels)
- Mix concerns in one file
- Use default exports for utilities
- Create "utils" dumping grounds
- Over-use barrel exports (impacts tree-shaking)
- Use relative imports for deep paths

---

## Refactoring Guidelines

### When to split a file:
- File exceeds 300 lines
- File has multiple responsibilities
- Parts are reused elsewhere
- Tests become difficult

### When to create a new directory:
- More than 5 related files
- Clear sub-domain emerges
- Reusable module pattern

### When to consolidate files:
- Files are always imported together
- Circular dependencies arise
- Over-engineering becomes apparent

---

## Examples from NOVA

NOVA project structure that inspired our architecture:

```
nova-web/
├── app/[locale]/          # Next.js 14 App Router
├── components/
│   ├── nova/             # Feature components
│   ├── ui/               # Generic UI (shadcn/ui)
│   ├── icons/            # Icon components
│   └── utility/          # Utility components
├── lib/
│   ├── nova-client.ts    # API client singleton
│   ├── config.ts         # Configuration classes
│   ├── conversation-api.ts
│   └── file-upload-errors.ts
├── context/
│   └── nova-context.tsx  # Global state
├── hooks/
│   └── useIsClient.ts
└── public/
    ├── locales/          # i18n translations
    └── assets/
```

---

**Last Updated:** 2024-04-13
**Reference:** NOVA Project Structure & React Best Practices
