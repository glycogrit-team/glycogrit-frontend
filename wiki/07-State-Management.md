# State Management

This document covers state management patterns in GlycoGrit using React hooks and Context API.

## Table of Contents
- [State Types](#state-types)
- [Local State](#local-state)
- [Global State with Context](#global-state-with-context)
- [Server State](#server-state)
- [Form State](#form-state)
- [URL State](#url-state)
- [Best Practices](#best-practices)

---

## State Types

### 1. Local Component State
**When to use:** UI state specific to one component
**Tool:** `useState`, `useReducer`

### 2. Shared State
**When to use:** State shared between components
**Tool:** Lifting state up, Context API

### 3. Server State
**When to use:** Data from API
**Tool:** Custom hooks (`useChallenges`, etc.)

### 4. Form State
**When to use:** Form inputs and validation
**Tool:** Custom form hooks, libraries

### 5. URL State
**When to use:** Filters, pagination, tabs
**Tool:** React Router, `useSearchParams`

---

## Local State

### useState

```typescript
// Simple state
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
const [isOpen, setIsOpen] = useState(false);

// Lazy initialization for expensive computations
const [items, setItems] = useState(() => {
  return expensiveComputation();
});

// Functional updates
setCount(prevCount => prevCount + 1);
```

### useReducer

```typescript
// For complex state logic
type State = {
  data: Item[];
  loading: boolean;
  error: string | null;
  page: number;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'NEXT_PAGE' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
}

function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      {state.loading && <Spinner />}
      {state.error && <Error message={state.error} />}
      {state.data.map(item => <Item key={item.id} {...item} />)}
      <button onClick={() => dispatch({ type: 'NEXT_PAGE' })}>
        Next Page
      </button>
    </div>
  );
}
```

---

## Global State with Context

### Creating Context

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const userData = await apiClient.login(email, password);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    AuthService.removeToken();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Using Context

```typescript
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hi, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

---

## Server State

### Custom Hooks for Data Fetching

```typescript
// hooks/useChallenges.ts
export function useChallenges(filters?: ChallengeFilters) {
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

// Usage
function ChallengeList() {
  const { challenges, loading, error, refetch } = useChallenges({
    category: 'running'
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

---

## Form State

### Custom Form Hook

```typescript
// hooks/useForm.ts
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

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
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue: (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }));
    },
    setFieldError: (field: keyof T, error: string) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };
}

// Usage
function LoginForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(values.email)) {
        errors.email = 'Invalid email format';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await apiClient.login(values.email, values.password);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## URL State

### Using URL Parameters

```typescript
import { useSearchParams } from 'react-router-dom';

function ChallengeList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  // Update URL
  const setCategory = (cat: string) => {
    setSearchParams(prev => {
      prev.set('category', cat);
      prev.set('page', '1'); // Reset to first page
      return prev;
    });
  };

  const setDifficulty = (diff: string) => {
    setSearchParams(prev => {
      prev.set('difficulty', diff);
      prev.set('page', '1');
      return prev;
    });
  };

  const nextPage = () => {
    setSearchParams(prev => {
      prev.set('page', String(page + 1));
      return prev;
    });
  };

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="running">Running</option>
        <option value="cycling">Cycling</option>
      </select>

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="all">All</option>
        <option value="beginner">Beginner</option>
        <option value="advanced">Advanced</option>
      </select>

      <ChallengeGrid category={category} difficulty={difficulty} page={page} />

      <button onClick={nextPage}>Next Page</button>
    </div>
  );
}
```

---

## Best Practices

### DO ✅

**1. Keep State Close to Where It's Used**
```typescript
// ✅ Good - Local state in component
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// ❌ Bad - Unnecessarily lifting state
function App() {
  const [count, setCount] = useState(0);  // Only used in Counter
  return <Counter count={count} setCount={setCount} />;
}
```

**2. Derive State When Possible**
```typescript
// ✅ Good - Derive state
function UserProfile({ users }: { users: User[] }) {
  const activeUsers = users.filter(u => u.isActive);
  const adminCount = users.filter(u => u.role === 'admin').length;

  return <div>Active: {activeUsers.length}, Admins: {adminCount}</div>;
}

// ❌ Bad - Store derived state
function UserProfile({ users }: { users: User[] }) {
  const [activeUsers, setActiveUsers] = useState(users.filter(u => u.isActive));
  const [adminCount, setAdminCount] = useState(users.filter(u => u.role === 'admin').length);

  useEffect(() => {
    setActiveUsers(users.filter(u => u.isActive));
    setAdminCount(users.filter(u => u.role === 'admin').length);
  }, [users]);

  return <div>Active: {activeUsers.length}, Admins: {adminCount}</div>;
}
```

**3. Use Functional Updates**
```typescript
// ✅ Good - Functional update
setCount(prevCount => prevCount + 1);

// ❌ Bad - Direct update (can cause stale closure bugs)
setCount(count + 1);
```

**4. Batch State Updates**
```typescript
// React 18 automatically batches updates
setCount(count + 1);
setName('John');
setIsActive(true);
// Only one re-render
```

**5. Use useReducer for Complex State**
```typescript
// ✅ Good - useReducer for related state
const [state, dispatch] = useReducer(reducer, {
  data: [],
  loading: false,
  error: null,
  filters: {}
});

// ❌ Bad - Multiple useState for related state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({});
```

### DON'T ❌

**1. Don't Mutate State Directly**
```typescript
// ❌ Bad
const [user, setUser] = useState({ name: 'John', age: 30 });
user.age = 31;  // Mutation!
setUser(user);

// ✅ Good
setUser(prev => ({ ...prev, age: 31 }));
```

**2. Don't Use State for Constants**
```typescript
// ❌ Bad
const [apiUrl, setApiUrl] = useState('https://api.example.com');

// ✅ Good
const API_URL = 'https://api.example.com';
```

**3. Don't Duplicate Server State**
```typescript
// ❌ Bad - Storing API data in context
function App() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    apiClient.getChallenges().then(setChallenges);
  }, []);

  return (
    <ChallengeContext.Provider value={challenges}>
      {/* ... */}
    </ChallengeContext.Provider>
  );
}

// ✅ Good - Use hooks for server state
function ChallengeList() {
  const { challenges, loading, error } = useChallenges();
  // Each component fetches its own data
}
```

---

**Last Updated:** 2024-04-13
**Reference:** React State Management Best Practices
