# GlycoGrit Architecture Documentation

**Version**: 1.0.0
**Last Updated**: April 14, 2024
**Inspired By**: NOVA Project (New Relic)

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Project Structure](#project-structure)
- [Core Design Patterns](#core-design-patterns)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Performance Considerations](#performance-considerations)
- [Best Practices](#best-practices)

---

## Overview

GlycoGrit is a fitness challenge tracking platform built with modern web technologies, following enterprise-grade patterns inspired by the NOVA project at New Relic. The architecture emphasizes:

- **Type Safety**: TypeScript strict mode throughout
- **Scalability**: Modular component architecture
- **Security**: Defense-in-depth approach
- **Performance**: Optimized builds and lazy loading
- **Maintainability**: Clear separation of concerns

---

## Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library with concurrent features |
| TypeScript | 5.3 | Strict type checking |
| Vite | 5.2 | Fast build tool with HMR |

### Routing & State
| Technology | Version | Purpose |
|------------|---------|---------|
| React Router | 6.21 | Client-side routing |
| Context API | - | Global state management |
| Custom Hooks | - | Reusable business logic |

### Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| CSS Variables | - | Theme customization |
| PostCSS | - | CSS processing |

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript Compiler**: Type checking

### Deployment
- **Vercel**: Hosting and CI/CD
- **GitHub**: Version control
- **Namecheap**: DNS management

---

## Architecture Patterns

### 1. Component Architecture

```
components/
├── common/          # Reusable UI components
│   ├── Button/
│   ├── Card/
│   └── Input/
├── layout/          # Layout components
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
└── features/        # Feature-specific components
    ├── challenges/
    ├── auth/
    └── profile/
```

**Principles:**
- **Composition over Inheritance**: Build complex UIs from simple components
- **Single Responsibility**: Each component has one clear purpose
- **Props Down, Events Up**: Unidirectional data flow
- **Presentational vs Container**: Separate UI from logic

### 2. Singleton Pattern (API Clients)

Based on NOVA's API client pattern:

```typescript
export class APIClient {
  private static instance: APIClient;
  private baseURL: string;
  private timeout: number;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  async get<T>(endpoint: string): Promise<T> {
    // Implementation with error handling
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // Implementation with error handling
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance();
```

**Benefits:**
- Single point of API configuration
- Centralized error handling
- Request/response interceptors
- Easy to mock for testing

### 3. Configuration Classes

Following NOVA's configuration class pattern:

```typescript
export class ChallengeConfig {
  // Pagination
  static readonly DEFAULT_PAGE_SIZE = 20;
  static readonly MAX_PAGE_SIZE = 100;
  static readonly MIN_PAGE_SIZE = 1;

  // Caching
  static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Validation
  static validatePageSize(size: number): number {
    return Math.min(
      Math.max(size, this.MIN_PAGE_SIZE),
      this.MAX_PAGE_SIZE
    );
  }

  static getConfigSummary() {
    return {
      pagination: {
        defaultPageSize: this.DEFAULT_PAGE_SIZE,
        maxPageSize: this.MAX_PAGE_SIZE
      },
      caching: {
        duration: this.CACHE_DURATION
      }
    };
  }
}
```

### 4. Custom Hooks Pattern

```typescript
interface UseChallengesReturn {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChallenges(
  filters?: ChallengeFilters
): UseChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getChallenges(filters);
      setChallenges(data);
    } catch (err) {
      setError(getUserFriendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return { challenges, loading, error, refetch: fetchChallenges };
}
```

### 5. Error Handling Pattern

Following NOVA's custom error classes:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromResponse(response: Response): APIError {
    const retryable = response.status >= 500 || response.status === 429;
    return new APIError(
      response.statusText,
      response.status,
      undefined,
      retryable
    );
  }
}

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You don\'t have permission to do this';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Too many requests. Please try again later';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred';
}
```

---

## Project Structure

```
glycogrit-frontend/
├── .claude/                     # Claude Code configuration
│   ├── skills/                  # Custom Claude skills
│   │   ├── code-review.md      # Code review skill
│   │   ├── code-review.sh      # Review script
│   │   ├── arch-check.md       # Architecture validation
│   │   └── name-check.md       # Naming convention checker
│   └── managed-settings.json    # Security permissions
├── public/                      # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/                  # Images, fonts, icons
│   ├── components/              # React components
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts        # Barrel export
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   └── features/            # Feature-specific components
│   │       ├── challenges/
│   │       └── auth/
│   ├── hooks/                   # Custom React hooks
│   │   ├── useChallenges.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── lib/                     # Core libraries
│   │   ├── api-client.ts        # API client singleton
│   │   ├── config.ts            # Configuration classes
│   │   ├── errors.ts            # Custom error classes
│   │   └── utils.ts             # Utility functions
│   ├── pages/                   # Route-level components
│   │   ├── Home.tsx
│   │   ├── Challenges.tsx
│   │   └── ChallengeDetail.tsx
│   ├── types/                   # TypeScript type definitions
│   │   ├── challenge.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── utils/                   # Helper functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
# Technical documentation now on GitHub Wiki
# https://github.com/glycogrit-team/glycogrit-frontend/wiki
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore patterns
├── ARCHITECTURE.md              # This file
├── CONTRIBUTING.md              # Contribution guidelines
├── README.md                    # Project overview
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
└── vercel.json                  # Vercel deployment configuration
```

---

## Core Design Patterns

### Module Organization with Barrel Exports

```typescript
// ✅ Good: Barrel exports for clean imports
// components/common/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// Usage
import { Button, Card, Input } from '@/components/common';
```

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/lib/*": ["src/lib/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### Component Composition

```typescript
// ✅ Good: Composition pattern
<Card>
  <CardHeader>
    <CardTitle>Challenge Details</CardTitle>
  </CardHeader>
  <CardContent>
    <ChallengeInfo challenge={challenge} />
  </CardContent>
  <CardFooter>
    <Button onClick={handleJoin}>Join Challenge</Button>
  </CardFooter>
</Card>

// ❌ Bad: Monolithic component with many props
<ChallengeCard
  challenge={challenge}
  showHeader={true}
  showFooter={true}
  onJoin={handleJoin}
  headerClassName="..."
  footerClassName="..."
/>
```

---

## Data Flow

### API Request Flow

```
User Action (Button Click)
    ↓
Component Event Handler
    ↓
Custom Hook (useChallenges)
    ↓
API Client Singleton
    ↓
HTTP Request (fetch)
    ↓
Backend API
    ↓
Response
    ↓
Error Handling / Data Transformation
    ↓
State Update (useState/Context)
    ↓
Component Re-render
    ↓
UI Update
```

### State Management Hierarchy

```
Global State (React Context)
├── AuthContext           # User authentication
├── ThemeContext          # UI theme (light/dark)
└── NotificationContext   # Toast notifications

Local State (useState/useReducer)
├── Form state            # Input values, validation
├── UI state              # Modals, dropdowns, loading
└── Temporary data        # Filters, sort order, search

Server State (Custom Hooks)
├── useChallenges         # Challenge data from API
├── useProfile            # User profile data
└── useLeaderboard        # Leaderboard rankings
```

---

## Security Architecture

### Defense-in-Depth Layers

Following NOVA's security patterns:

1. **Input Validation**
   - TypeScript type checking at compile time
   - Runtime validation with Zod/Yup schemas
   - Sanitization of user input before display

2. **Authentication**
   - JWT tokens stored in httpOnly cookies
   - Token refresh mechanism
   - Automatic logout on token expiry

3. **Authorization**
   - Role-based access control (RBAC)
   - Protected routes with route guards
   - API-level permission checks

4. **XSS Prevention**
   - React automatic escaping
   - DOMPurify for sanitizing HTML content
   - Content Security Policy headers

5. **CSRF Protection**
   - SameSite cookie attribute
   - CSRF tokens for state-changing operations
   - Origin header validation

6. **Secrets Management**
   - Environment variables for configuration
   - Never commit secrets to git (.env in .gitignore)
   - Vercel environment variables for production
   - Claude Code permissions deny reading .env files

### Security Headers

Configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
      ]
    }
  ]
}
```

### Claude Code Security Permissions

Configured in `.claude/managed-settings.json` (based on NOVA patterns):

**Allowed:**
- Read, Grep, Glob (code analysis)
- Git status, diff, log (version control queries)
- npm run, test, build (development tasks)

**Denied:**
- Read/Write/Edit .env files
- Read secrets, .pem, .key files
- Destructive commands (rm -rf, sudo)
- Network commands (curl, wget, ssh)
- Git push, publish operations

---

## Deployment Architecture

### Environments

```
┌──────────────────────┐
│    Development       │ ← Local development (npm run dev)
│   localhost:5173     │   Branch: feature/*
└──────────────────────┘
         ↓ git push origin staging
┌──────────────────────┐
│      Staging         │ ← Vercel preview deployment
│  staging.glycogrit   │   Branch: staging
│     .vercel.app      │   Auto-deploy on push
└──────────────────────┘
         ↓ git push origin master
┌──────────────────────┐
│     Production       │ ← Vercel production deployment
│    glycogrit.com     │   Branch: master
│                      │   Manual merge from staging
└──────────────────────┘
```

### CI/CD Pipeline (Vercel)

```
Git Push to Branch
    ↓
Vercel Webhook Triggered
    ↓
Clone Repository
    ↓
Install Dependencies (npm ci)
    ↓
Environment Variables Injected
    ↓
Run Type Check (tsc --noEmit)
    ↓
Run Linter (eslint --max-warnings 0)
    ↓
Build Application (npm run build)
    ↓
Deploy to Vercel Edge Network
    ↓
Health Check (/health endpoint)
    ↓
DNS Update (if production)
    ↓
Deployment Live!
```

### DNS Configuration

```
Domain: glycogrit.com (managed at Namecheap)
    ↓
DNS Records:
├── A Record:    @ → 76.76.21.21 (Vercel IP)
├── CNAME:     www → cname.vercel-dns.com
├── TXT: _vercel   → [verification token]
└── CAA Record     → letsencrypt.org (SSL)
    ↓
Vercel Edge Network (CDN)
├── us-east-1 (IAD)
├── us-west-1 (SFO)
└── eu-west-1 (DUB)
    ↓
Application Served with HTTPS
```

---

## Performance Considerations

### Code Splitting

```typescript
// Route-based code splitting with React.lazy
import { lazy, Suspense } from 'react';

const ChallengeList = lazy(() => import('./pages/ChallengeList'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/challenges" element={<ChallengeList />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization Strategies

```typescript
// 1. Expensive computations with useMemo
const sortedChallenges = useMemo(() => {
  return challenges
    .filter(c => c.difficulty === selectedDifficulty)
    .sort((a, b) => b.participants - a.participants);
}, [challenges, selectedDifficulty]);

// 2. Callback memoization with useCallback
const handleChallengeSelect = useCallback((id: string) => {
  navigate(`/challenges/${id}`);
}, [navigate]);

// 3. Component memoization with React.memo
const ChallengeCard = memo(({ challenge, onSelect }: Props) => {
  return (
    <Card onClick={() => onSelect(challenge.id)}>
      {/* ... */}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.challenge.id === nextProps.challenge.id;
});
```

### Asset Optimization

| Asset Type | Optimization Strategy |
|------------|----------------------|
| **Images** | WebP format with JPEG fallback, lazy loading, responsive sizes |
| **Fonts** | Subset to needed characters, preload critical fonts, font-display: swap |
| **CSS** | Tailwind purging, critical CSS inline, non-critical async |
| **JavaScript** | Tree shaking, minification, gzip/brotli compression |

### Caching Strategy

```
Static Assets (Hashed Filenames)
└── Cache-Control: public, max-age=31536000, immutable
    (CSS, JS, images with content hash in filename)

HTML (index.html)
└── Cache-Control: public, max-age=0, must-revalidate
    (Always check for updates)

API Responses
├── GET /challenges
│   └── Cache-Control: private, max-age=300 (5 min)
├── GET /challenges/:id
│   └── Cache-Control: private, max-age=600 (10 min)
└── POST /challenges
    └── Cache-Control: no-cache (no caching)

Vercel Edge CDN
└── Automatic edge caching with geographic distribution
```

---

## Best Practices

### Do's ✅

1. **Use TypeScript strict mode** for maximum type safety
2. **Follow component composition pattern** over prop drilling
3. **Implement proper error handling** with custom error classes
4. **Use custom hooks** for reusable business logic
5. **Memoize expensive operations** (useMemo, useCallback, React.memo)
6. **Write descriptive names** for components, functions, and variables
7. **Keep components small and focused** (single responsibility)
8. **Use environment variables** for configuration (never hardcode)
9. **Implement loading and error states** in all data-fetching components
10. **Follow security best practices** (input validation, XSS prevention)

### Don'ts ❌

1. **Don't mutate state directly** (always use setState)
2. **Don't use inline styles** (use Tailwind CSS classes)
3. **Don't hardcode configuration values** (use config classes)
4. **Don't use `any` type** in TypeScript (use specific types or `unknown`)
5. **Don't skip error handling** (always handle Promise rejections)
6. **Don't commit secrets to git** (.env files should be gitignored)
7. **Don't create god components** (split into smaller components)
8. **Don't use class components** (use functional components with hooks)
9. **Don't forget accessibility** (add aria-* attributes, semantic HTML)
10. **Don't skip code reviews** (all PRs require approval)

---

## Key Architectural Decisions

### Why TypeScript?
- **Compile-time type checking** catches errors early
- **Better IDE support** with autocomplete and refactoring
- **Self-documenting code** with interfaces and types
- **Safer refactoring** with confidence

### Why Singleton for API Client?
- **Single point of configuration** for all API calls
- **Centralized error handling** and retry logic
- **Easy to mock** for testing
- **Consistent behavior** across the application

### Why Configuration Classes?
- **Type-safe constants** prevent magic numbers
- **Centralized configuration** easy to find and modify
- **Validation methods** ensure correct usage
- **Environment-aware** can adjust based on env

### Why Custom Hooks?
- **Reusable business logic** across components
- **Testable in isolation** without rendering components
- **Clean component code** separates UI from logic
- **Follows React patterns** modern best practices

### Why Vercel for Deployment?
- **Zero-config deployment** works out of the box with Vite
- **Global CDN** for fast content delivery
- **Preview deployments** for every PR
- **Automatic HTTPS** and SSL certificates
- **Environment variables** management built-in

---

## References

### Internal Documentation (GitHub Wiki)
- [Coding Standards](https://github.com/glycogrit-team/glycogrit-frontend/wiki/01-Coding-Standards) - TypeScript and React conventions
- [Project Structure](https://github.com/glycogrit-team/glycogrit-frontend/wiki/02-Project-Structure) - Folder organization
- [Security Best Practices](https://github.com/glycogrit-team/glycogrit-frontend/wiki/04-Security-Best-Practices) - Security guidelines
- [Design Patterns](https://github.com/glycogrit-team/glycogrit-frontend/wiki/05-Design-Patterns) - Architecture patterns
- [Component Guidelines](https://github.com/glycogrit-team/glycogrit-frontend/wiki/06-Component-Guidelines) - Component best practices
- [State Management](https://github.com/glycogrit-team/glycogrit-frontend/wiki/07-State-Management) - State patterns
- [**View All Wiki Pages**](https://github.com/glycogrit-team/glycogrit-frontend/wiki)

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Inspiration
- **NOVA Project** (New Relic) - Enterprise patterns and security practices
- **shadcn/ui** - Component composition patterns
- **Next.js** - Build configuration and deployment strategies

---

**Maintained By**: GlycoGrit Team
**For Questions**: Open a GitHub issue or check the wiki

**Last Review Date**: April 14, 2024
