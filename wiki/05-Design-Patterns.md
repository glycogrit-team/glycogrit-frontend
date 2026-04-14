# Design Patterns

This document describes the key design patterns used in GlycoGrit, inspired by the NOVA project and industry best practices.

## Table of Contents
- [Overview](#overview)
- [Singleton Pattern](#singleton-pattern)
- [Configuration Classes Pattern](#configuration-classes-pattern)
- [Custom Hooks Pattern](#custom-hooks-pattern)
- [Context Provider Pattern](#context-provider-pattern)
- [Error Handling Pattern](#error-handling-pattern)
- [Component Composition Pattern](#component-composition-pattern)
- [Render Props Pattern](#render-props-pattern)
- [Higher-Order Components (HOC)](#higher-order-components-hoc)
- [Compound Components Pattern](#compound-components-pattern)

---

## Overview

Design patterns are reusable solutions to common problems. This document covers patterns used throughout the GlycoGrit codebase.

**Benefits:**
- **Consistency** - Same problems solved the same way
- **Maintainability** - Familiar patterns are easier to modify
- **Scalability** - Proven patterns scale well
- **Communication** - Team speaks common language

---

## Singleton Pattern

### What is it?
Ensures a class has only one instance and provides global access to it.

### When to use?
- API clients
- Configuration managers
- Logger instances
- Cache managers

### Implementation

**API Client Singleton:**
```typescript
// lib/api-client.ts
export class GlycogritAPIClient {
  private static instance: GlycogritAPIClient;
  private baseUrl: string;
  private timeout: number;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
    this.timeout = AppConfig.API_TIMEOUT;
  }

  // Static method to get the single instance
  public static getInstance(): GlycogritAPIClient {
    if (!GlycogritAPIClient.instance) {
      GlycogritAPIClient.instance = new GlycogritAPIClient();
    }
    return GlycogritAPIClient.instance;
  }

  async getChallenges(): Promise<Challenge[]> {
    // Implementation
  }
}

// Export singleton instance
export const apiClient = GlycogritAPIClient.getInstance();

// Usage throughout the app
import { apiClient } from '@/lib/api-client';

const challenges = await apiClient.getChallenges();
```

**Simpler Singleton (Module Pattern):**
```typescript
// lib/logger.ts
class Logger {
  private logs: string[] = [];

  log(message: string): void {
    console.log(message);
    this.logs.push(message);
  }

  getLogs(): string[] {
    return this.logs;
  }
}

// Create and export single instance
export const logger = new Logger();

// Usage
import { logger } from '@/lib/logger';
logger.log('Application started');
```

### Benefits
- ✅ Single source of truth
- ✅ Global access point
- ✅ Lazy initialization
- ✅ Easy to test with mocking

### Drawbacks
- ❌ Can make testing harder if not careful
- ❌ Global state can lead to tight coupling
- ❌ Harder to manage in SSR environments

---

## Configuration Classes Pattern

### What is it?
Static classes that hold application configuration with utility methods.

### When to use?
- Application settings
- Feature flags
- Constants with related logic
- Environment-specific values

### Implementation

```typescript
// lib/config.ts

/**
 * Challenge Configuration
 * Centralized settings for challenge-related features
 */
export class ChallengeConfig {
  // Constants
  static readonly CATEGORIES = ['running', 'cycling', 'walking', 'mixed', 'strength'] as const;
  static readonly DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
  static readonly MIN_PARTICIPANTS = 0;
  static readonly MAX_DURATION_DAYS = 365;

  /**
   * Get display name for category
   */
  static getCategoryDisplayName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Get badge color for difficulty
   */
  static getDifficultyColor(difficulty: string): 'success' | 'warning' | 'info' | 'default' {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'info';
      default:
        return 'default';
    }
  }

  /**
   * Validate challenge category
   */
  static isValidCategory(category: string): boolean {
    return this.CATEGORIES.includes(category as any);
  }

  /**
   * Get configuration summary (for debugging)
   */
  static getConfigSummary() {
    return {
      categories: this.CATEGORIES,
      difficultyLevels: this.DIFFICULTY_LEVELS,
      maxDuration: this.MAX_DURATION_DAYS
    };
  }
}

/**
 * API Configuration
 */
export class APIConfig {
  static readonly DEFAULT_TIMEOUT_MS = 30000;
  static readonly UPLOAD_TIMEOUT_MS = 120000;
  static readonly MAX_RETRIES = 3;
  static readonly RETRY_DELAY_MS = 1000;

  static getTimeout(operationType: 'default' | 'upload' = 'default'): number {
    return operationType === 'upload' ? this.UPLOAD_TIMEOUT_MS : this.DEFAULT_TIMEOUT_MS;
  }
}

/**
 * UI Configuration
 */
export class UIConfig {
  static readonly ANIMATION_FAST = 150;
  static readonly ANIMATION_NORMAL = 200;
  static readonly ANIMATION_SLOW = 300;

  static readonly BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  } as const;

  static readonly TOAST_DURATION_SUCCESS = 3000;
  static readonly TOAST_DURATION_ERROR = 5000;
}
```

### Usage

```typescript
// In components
import { ChallengeConfig } from '@/lib/config';

function ChallengeCard({ challenge }: Props) {
  const color = ChallengeConfig.getDifficultyColor(challenge.difficulty);
  const displayName = ChallengeConfig.getCategoryDisplayName(challenge.category);

  return (
    <Card>
      <Badge color={color}>{displayName}</Badge>
    </Card>
  );
}
```

### Benefits
- ✅ Single source of truth for configuration
- ✅ Type-safe constants
- ✅ Related logic co-located with configuration
- ✅ Easy to modify and maintain
- ✅ Self-documenting code

---

## Custom Hooks Pattern

### What is it?
Encapsulate reusable stateful logic in custom React hooks.

### When to use?
- Data fetching
- Form handling
- UI state management
- Side effects management
- Sharing logic between components

### Implementation Patterns

**1. Data Fetching Hook:**
```typescript
// hooks/useChallenges.ts
interface UseChallengesOptions {
  category?: string;
  difficulty?: string;
  autoFetch?: boolean;
}

interface UseChallengesReturn {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChallenges(options: UseChallengesOptions = {}): UseChallengesReturn {
  const { category, difficulty, autoFetch = true } = options;
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getChallenges({ category, difficulty });
      setChallenges(data);
    } catch (err) {
      const errorMessage = getUserFriendlyMessage(err);
      setError(errorMessage);
      logError(err, { category, difficulty });
    } finally {
      setLoading(false);
    }
  }, [category, difficulty]);

  useEffect(() => {
    if (autoFetch) {
      fetchChallenges();
    }
  }, [autoFetch, fetchChallenges]);

  return {
    challenges,
    loading,
    error,
    refetch: fetchChallenges
  };
}

// Usage
function ChallengeList() {
  const { challenges, loading, error, refetch } = useChallenges({
    category: 'running',
    difficulty: 'beginner'
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div>
      {challenges.map(c => <ChallengeCard key={c.id} challenge={c} />)}
    </div>
  );
}
```

**2. UI State Hook:**
```typescript
// hooks/useMediaQuery.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

**3. Form Hook:**
```typescript
// hooks/useForm.ts
interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  };
}

// Usage
function ChallengeForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: '',
      description: '',
      category: 'running'
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) errors.title = 'Title is required';
      if (values.title.length < 3) errors.title = 'Title too short';
      return errors;
    },
    onSubmit: async (values) => {
      await apiClient.createChallenge(values);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.title}
        onChange={handleChange('title')}
      />
      {errors.title && <span>{errors.title}</span>}
      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

### Hook Composition

Hooks can call other hooks:

```typescript
// hooks/useChallengeWithUser.ts
export function useChallengeWithUser(challengeId: string) {
  const { challenge, loading: challengeLoading } = useChallenge(challengeId);
  const { user, loading: userLoading } = useAuth();
  const { joinChallenge, leaving } = useChallengeActions();

  const isParticipant = useMemo(() => {
    return challenge?.participants?.includes(user?.id);
  }, [challenge, user]);

  const handleJoin = useCallback(async () => {
    if (!user) return;
    await joinChallenge(challengeId, user.id);
  }, [challengeId, user, joinChallenge]);

  return {
    challenge,
    user,
    isParticipant,
    loading: challengeLoading || userLoading,
    handleJoin,
    leaving
  };
}
```

### Benefits
- ✅ Reusable stateful logic
- ✅ Cleaner components
- ✅ Testable in isolation
- ✅ Easier to reason about
- ✅ Follows React's composition model

---

## Context Provider Pattern

### What is it?
Share state across component tree without prop drilling.

### When to use?
- Global state (auth, theme, language)
- State shared by many components
- Deeply nested component trees
- Avoiding prop drilling

### Implementation

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: userData } = await apiClient.login(email, password);
      AuthService.setToken(token);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.logout();
      AuthService.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage in App.tsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
}

// Usage in components
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

### Multiple Providers

```typescript
// App.tsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <Router>
            <Routes />
          </Router>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### Benefits
- ✅ Avoid prop drilling
- ✅ Global state management
- ✅ Cleaner component tree
- ✅ Easy to add/remove providers

### Drawbacks
- ❌ Can lead to unnecessary re-renders
- ❌ Not suitable for frequently changing state
- ❌ Context updates trigger all consumers to re-render

---

## Error Handling Pattern

### What is it?
Centralized error handling with custom error classes and type discrimination.

### Implementation

```typescript
// lib/errors.ts

/**
 * Base API Error class
 */
export class APIError extends Error {
  public readonly errorType: ErrorType = 'api';
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500, retryable: boolean = false) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      errorType: this.errorType,
      message: this.message,
      statusCode: this.statusCode,
      retryable: this.retryable,
      timestamp: this.timestamp.toISOString()
    };
  }
}

/**
 * Network Error (connectivity issues)
 */
export class NetworkError extends APIError {
  public readonly errorType: ErrorType = 'network';

  constructor(message: string = 'Network error occurred', retryable: boolean = true) {
    super(message, 0, retryable);
    this.name = 'NetworkError';
  }
}

/**
 * Validation Error (client or server validation)
 */
export class ValidationError extends APIError {
  public readonly errorType: ErrorType = 'validation';
  public readonly validationErrors: Record<string, unknown>;

  constructor(message: string, validationErrors: Record<string, unknown> = {}) {
    super(message, 400, false);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

// Type guards
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isRetryableError(error: unknown): boolean {
  return error instanceof APIError && error.retryable;
}

// User-friendly error messages
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection.';
  }

  if (error instanceof APIError) {
    if (error.statusCode >= 500) {
      return 'Something went wrong. Please try again later.';
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

// Error logging
export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    if (context) console.log('Context:', context);
    if (error instanceof APIError) {
      console.table(error.toJSON());
    }
    console.groupEnd();
  } else {
    // In production, send to error tracking service
    // Sentry.captureException(error, { extra: context });
  }
}
```

### Usage in API Client

```typescript
// lib/api-client.ts
export class APIClient {
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', true);
        }
        throw new NetworkError(error.message, true);
      }

      throw new NetworkError('Unknown error', false);
    }
  }

  private async handleErrorResponse(response: Response): Promise<APIError> {
    const statusCode = response.status;

    if (statusCode === 400) {
      const data = await response.json();
      return new ValidationError(data.message, data.errors);
    }

    if (statusCode >= 500) {
      return new APIError('Server error', statusCode, true);
    }

    return new APIError(`HTTP ${statusCode}`, statusCode, false);
  }
}
```

### Usage in Components

```typescript
function ChallengeList() {
  const { challenges, loading, error } = useChallenges();

  if (loading) return <Spinner />;

  if (error) {
    const isNetwork = isNetworkError(error);
    const canRetry = isRetryableError(error);

    return (
      <ErrorDisplay
        message={getUserFriendlyMessage(error)}
        canRetry={canRetry}
        onRetry={canRetry ? refetch : undefined}
      />
    );
  }

  return <div>{/* challenges list */}</div>;
}
```

### Benefits
- ✅ Type-safe error handling
- ✅ Rich error context
- ✅ User-friendly messages
- ✅ Easier debugging
- ✅ Centralized error logic

---

## Component Composition Pattern

### What is it?
Build complex UIs by composing smaller, focused components.

### Implementation

**Compound Components:**
```typescript
// components/common/Card.tsx
interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-6', className)}>
      {children}
    </div>
  );
}

// Sub-components
Card.Header = function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold', className)}>
      {children}
    </h3>
  );
};

Card.Content = function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('text-gray-600', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t', className)}>
      {children}
    </div>
  );
};

// Usage
function ChallengeCard({ challenge }: Props) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{challenge.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>{challenge.description}</p>
      </Card.Content>
      <Card.Footer>
        <Button>Join Challenge</Button>
      </Card.Footer>
    </Card>
  );
}
```

### Benefits
- ✅ Flexible and composable
- ✅ Intuitive API
- ✅ Easy to extend
- ✅ Self-documenting

---

**Last Updated:** 2024-04-13
**Based on:** NOVA Project & React Best Practices
