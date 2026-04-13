# GlycoGrit Frontend Architecture

This document describes the architecture and design patterns used in the GlycoGrit Frontend application, inspired by professional patterns from the NOVA project.

## Table of Contents
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Configuration Management](#configuration-management)
- [API Layer](#api-layer)
- [Error Handling](#error-handling)
- [Custom Hooks](#custom-hooks)
- [Utility Functions](#utility-functions)
- [Path Aliases](#path-aliases)

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Generic reusable components (Button, Card, Badge)
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── features/       # Feature-specific components (ChallengeCard)
├── pages/              # Route-level page components
│   ├── Home.tsx
│   ├── Challenges.tsx
│   └── ChallengeDetail.tsx
├── lib/                # Core library code
│   ├── config.ts       # Application configuration
│   ├── api-client.ts   # API client layer
│   └── errors.ts       # Custom error classes
├── hooks/              # Custom React hooks
│   ├── useChallenges.ts
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   ├── format.ts       # Formatting utilities
│   ├── validation.ts   # Validation utilities
│   └── helpers.ts      # General helper functions
├── types/              # TypeScript type definitions
│   └── challenge.ts
├── constants/          # Application constants and mock data
│   └── challenges.ts
└── assets/             # Static assets (images, fonts, etc.)
```

## Design Patterns

### 1. Class-Based API Client (Singleton Pattern)

Instead of scattered fetch calls, we use a centralized API client class:

```typescript
// lib/api-client.ts
export class GlycogritAPIClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
    this.timeout = AppConfig.API_TIMEOUT;
  }

  async getChallenges(params?: {...}): Promise<Challenge[]> {
    // Centralized API logic
  }
}

// Export singleton instance
export const apiClient = new GlycogritAPIClient();
```

**Benefits:**
- Single source of truth for API calls
- Consistent error handling
- Easy to test and mock
- Type-safe methods

### 2. Static Configuration Classes

All configuration is centralized in static classes instead of scattered constants:

```typescript
// lib/config.ts
export class AppConfig {
  static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  static readonly API_TIMEOUT = 30000;

  static validatePageSize(limit: number): number {
    // Validation logic
  }
}

export class ChallengeConfig {
  static readonly CATEGORIES = ['running', 'cycling', 'walking', 'mixed', 'strength'] as const;

  static getDifficultyColor(difficulty: string): 'success' | 'warning' | 'info' | 'default' {
    // Logic
  }
}
```

**Benefits:**
- Type-safe configuration
- Easy to find and modify settings
- Includes utility methods related to configuration
- No magic numbers scattered in code

### 3. Custom Error Classes with Type Discrimination

Rich error handling with different error types:

```typescript
// lib/errors.ts
export class APIError extends Error {
  public readonly errorType: ErrorType = 'api';
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly timestamp: Date;

  toJSON() {
    // Serialize for logging
  }
}

export class NetworkError extends APIError {
  // Network-specific errors
}

export class ValidationError extends APIError {
  public readonly validationErrors: Record<string, unknown>;
  // Validation-specific errors
}
```

**Benefits:**
- Type-safe error handling
- Rich error context
- Easy to determine if errors are retryable
- User-friendly error messages
- Proper logging support

### 4. Custom React Hooks

Encapsulate complex logic in reusable hooks:

```typescript
// hooks/useChallenges.ts
export function useChallenges(options?: {...}): UseChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Logic

  return { challenges, loading, error, refetch };
}

// Usage in component
const { challenges, loading, error, refetch } = useChallenges({
  category: 'running',
  difficulty: 'beginner'
});
```

**Benefits:**
- Reusable business logic
- Consistent state management
- Easier testing
- Clean component code

## Configuration Management

The application uses a layered configuration approach:

### AppConfig
- API settings (base URL, timeout, retry attempts)
- Pagination defaults
- File upload limits
- Cache settings

### ChallengeConfig
- Challenge-specific constants
- Display name formatters
- Badge color mappings

### UIConfig
- Responsive breakpoints
- Animation durations
- Toast/notification settings
- Debounce delays

### RouteConfig
- Application routes
- URL builders

**Usage Example:**
```typescript
import { ChallengeConfig, RouteConfig } from '@/lib/config';

// Get color for difficulty badge
const color = ChallengeConfig.getDifficultyColor(challenge.difficulty);

// Build challenge detail URL
const url = RouteConfig.getChallengeDetailUrl(challenge.id);
```

## API Layer

### Features
- Centralized API client class
- Automatic request timeout
- Consistent error handling
- Type-safe method signatures
- Generic fetch wrapper
- Response/error transformations

### Usage
```typescript
import { apiClient } from '@/lib/api-client';

// Fetch challenges with filters
const challenges = await apiClient.getChallenges({
  category: 'running',
  difficulty: 'beginner',
  page: 1,
  limit: 12
});

// Join a challenge
await apiClient.joinChallenge(challengeId, userId);
```

## Error Handling

### Error Types
1. **APIError** - General API errors
2. **NetworkError** - Connectivity issues, timeouts
3. **ValidationError** - Client/server validation failures
4. **AuthError** - Authentication/authorization errors
5. **FileUploadError** - File upload specific errors

### Features
- Type discrimination for different error types
- Retryable flag for automatic retry logic
- Rich error context (status code, validation details, etc.)
- User-friendly error messages via `getUserFriendlyMessage()`
- Development logging via `logError()`
- JSON serialization for error tracking services

### Usage
```typescript
import { getUserFriendlyMessage, logError, isNetworkError } from '@/lib/errors';

try {
  await apiClient.getChallenges();
} catch (error) {
  const message = getUserFriendlyMessage(error);
  logError(error, { context: 'loading challenges' });

  if (isNetworkError(error)) {
    // Show retry option
  }
}
```

## Custom Hooks

### useChallenges
Fetch and manage challenges list with filters
```typescript
const { challenges, loading, error, refetch } = useChallenges({
  category: 'running',
  difficulty: 'beginner'
});
```

### useChallenge
Fetch a single challenge by ID
```typescript
const { challenge, loading, error, refetch } = useChallenge(challengeId);
```

### useChallengeActions
Handle challenge join/leave actions
```typescript
const { joining, leaving, joinChallenge, leaveChallenge } = useChallengeActions();
await joinChallenge(challengeId, userId);
```

### useMediaQuery
Responsive media query detection
```typescript
const isMobile = useIsMobile();
const isDesktop = useIsDesktop();
const matches = useMediaQuery('(min-width: 768px)');
```

### useDebounce
Debounce values for search inputs
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
```

### useLocalStorage
Type-safe localStorage management
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

## Utility Functions

### Formatting (`utils/format.ts`)
- `formatNumber()` - Format numbers with commas
- `formatDate()` - Format dates
- `formatRelativeTime()` - Relative time ("2 days ago")
- `formatDuration()` - Format durations
- `formatDistance()` - Format distances (m/km)
- `formatTimeDuration()` - Format time (1h 2m 3s)
- `formatPercentage()` - Format percentages
- `truncateText()` - Truncate with ellipsis
- `formatFileSize()` - Format file sizes

### Validation (`utils/validation.ts`)
- `isValidEmail()` - Email validation
- `isValidUrl()` - URL validation
- `isValidPhone()` - Phone validation
- `validatePassword()` - Password strength validation
- `isRequired()` - Required field validation
- `hasMinLength()` / `hasMaxLength()` - Length validation
- `isInRange()` - Number range validation
- `isFutureDate()` / `isPastDate()` - Date validation
- `validateForm()` - Generic form validation

### Helpers (`utils/helpers.ts`)
- `generateId()` - Generate random IDs
- `deepClone()` - Deep clone objects
- `sleep()` - Async delay
- `retry()` - Retry with exponential backoff
- `debounce()` / `throttle()` - Function rate limiting
- `groupBy()` / `sortBy()` / `unique()` - Array utilities
- `pick()` / `omit()` - Object utilities
- `deepMerge()` - Deep merge objects
- `getNestedValue()` / `setNestedValue()` - Nested object access
- `copyToClipboard()` - Copy text to clipboard
- `downloadFile()` - Download files
- `isMobileDevice()` - Device detection

## Path Aliases

Vite is configured with path aliases for cleaner imports:

```typescript
// Instead of:
import Button from '../../../components/common/Button';

// Use:
import Button from '@/components/common/Button';
```

### Available Aliases
- `@/` → `./src/`
- `@/components` → `./src/components`
- `@/pages` → `./src/pages`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`
- `@/utils` → `./src/utils`
- `@/types` → `./src/types`
- `@/constants` → `./src/constants`
- `@/assets` → `./src/assets`

## Best Practices

### 1. Always Use Configuration Classes
```typescript
// ❌ Bad
const maxSize = 10 * 1024 * 1024;

// ✅ Good
const maxSize = AppConfig.MAX_FILE_SIZE;
```

### 2. Use API Client for All API Calls
```typescript
// ❌ Bad
const response = await fetch('/api/challenges');

// ✅ Good
const challenges = await apiClient.getChallenges();
```

### 3. Proper Error Handling
```typescript
// ❌ Bad
try {
  await apiClient.getChallenges();
} catch (error) {
  console.error(error);
}

// ✅ Good
try {
  await apiClient.getChallenges();
} catch (error) {
  const message = getUserFriendlyMessage(error);
  logError(error, { context: 'loading challenges' });
  // Show user-friendly message
}
```

### 4. Use Custom Hooks for Data Fetching
```typescript
// ❌ Bad - Direct API calls in components
const [challenges, setChallenges] = useState([]);
useEffect(() => {
  apiClient.getChallenges().then(setChallenges);
}, []);

// ✅ Good - Use custom hook
const { challenges, loading, error } = useChallenges();
```

### 5. Leverage Utility Functions
```typescript
// ❌ Bad
const formatted = challenge.participants.toLocaleString();

// ✅ Good
import { formatNumber } from '@/utils/format';
const formatted = formatNumber(challenge.participants);
```

## Future Enhancements

1. **Add Authentication Context** - User authentication state management
2. **Add Theme Provider** - Dark mode support via Context API
3. **Add React Query** - Advanced data fetching and caching
4. **Add Error Boundary** - Component-level error handling
5. **Add Analytics** - User behavior tracking
6. **Add PWA Support** - Progressive Web App features
7. **Add Internationalization** - Multi-language support

## Testing Strategy

### Unit Tests
- Test utility functions in isolation
- Test custom hooks with `@testing-library/react-hooks`
- Test error classes and type guards

### Integration Tests
- Test API client methods with mocked fetch
- Test form validation with real user interactions
- Test component integration with hooks

### E2E Tests
- Test critical user flows (browse challenges, view details, join challenge)
- Test responsive behavior across devices

## Performance Considerations

1. **Code Splitting** - Pages are lazily loaded via React Router
2. **Memoization** - Use `useMemo` and `useCallback` where appropriate
3. **Debouncing** - Search inputs use `useDebounce` hook
4. **Image Optimization** - Use WebP format and lazy loading
5. **Bundle Analysis** - Regularly check bundle size with `vite-bundle-visualizer`

## Security Considerations

1. **XSS Prevention** - Use `sanitizeHtml()` for user-generated content
2. **CSRF Protection** - Include CSRF tokens in API requests
3. **Input Validation** - Validate all user inputs client-side and server-side
4. **Secure API Calls** - Use HTTPS and include authentication headers
5. **Content Security Policy** - Implement CSP headers in production

---

Last Updated: 2024-04-13
