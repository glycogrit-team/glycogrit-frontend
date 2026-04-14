# Component Guidelines

This document provides guidelines for building React components in the GlycoGrit project, covering structure, patterns, and best practices.

## Table of Contents
- [Component Types](#component-types)
- [Component Structure](#component-structure)
- [Props Patterns](#props-patterns)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Conditional Rendering](#conditional-rendering)
- [Performance Optimization](#performance-optimization)
- [Accessibility](#accessibility)
- [Testing Components](#testing-components)

---

## Component Types

### 1. Common Components (Generic/Reusable)

**Location:** `src/components/common/`
**Purpose:** Generic, reusable UI components

**Characteristics:**
- ✅ App-agnostic (could be used in any project)
- ✅ No business logic
- ✅ Highly configurable via props
- ✅ No external dependencies (except UI libraries)
- ✅ Fully tested

**Examples:**
```typescript
// Button.tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        getVariantStyles(variant),
        getSizeStyles(size),
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Card.tsx
interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
}

export default function Card({ children, hoverable, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        hoverable && 'hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 2. Layout Components

**Location:** `src/components/layout/`
**Purpose:** Define page structure and layout

**Characteristics:**
- ✅ App-specific
- ✅ Reused across multiple pages
- ✅ May contain routing logic
- ✅ Compose common components

**Examples:**
```typescript
// Navbar.tsx
export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-bold text-primary-600">
              GlycoGrit
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/challenges">Challenges</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hi, {user?.name}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} />
        )}
      </Container>
    </nav>
  );
}

// Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">GlycoGrit</h3>
            <p className="text-gray-600 text-sm">
              Transform your fitness journey with our challenges.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/challenges">Challenges</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} GlycoGrit. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
```

### 3. Feature Components

**Location:** `src/components/features/`
**Purpose:** Feature-specific, business logic components

**Characteristics:**
- ✅ Contain business logic
- ✅ Use hooks for data fetching
- ✅ Compose common components
- ✅ May be tied to specific features

**Examples:**
```typescript
// ChallengeCard.tsx
interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onJoin }: ChallengeCardProps) {
  const { user } = useAuth();
  const { joinChallenge, joining } = useChallengeActions();

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please login to join challenges');
      return;
    }

    try {
      await joinChallenge(challenge.id, user.id);
      toast.success('Successfully joined challenge!');
      onJoin?.(challenge.id);
    } catch (error) {
      toast.error(getUserFriendlyMessage(error));
    }
  };

  return (
    <Card hoverable>
      <div className="h-48 overflow-hidden rounded-t-lg">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={ChallengeConfig.getDifficultyColor(challenge.difficulty)}>
            {ChallengeConfig.getDifficultyDisplayName(challenge.difficulty)}
          </Badge>
          <span className="text-sm text-gray-500">
            {ChallengeConfig.getCategoryDisplayName(challenge.category)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {challenge.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {challenge.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {challenge.duration}
          </span>
          <span className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-1" />
            {formatNumber(challenge.participants)} joined
          </span>
        </div>

        <div className="flex gap-2">
          <Link to={RouteConfig.getChallengeDetailUrl(challenge.id)} className="flex-1">
            <Button variant="outline" fullWidth>
              View Details
            </Button>
          </Link>
          <Button
            onClick={handleJoin}
            disabled={joining}
            fullWidth
          >
            {joining ? 'Joining...' : 'Join Challenge'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ChallengeFilters.tsx
interface ChallengeFiltersProps {
  onFilterChange: (filters: ChallengeFilters) => void;
}

export default function ChallengeFilters({ onFilterChange }: ChallengeFiltersProps) {
  const [category, setCategory] = useState<ChallengeCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');

  useEffect(() => {
    onFilterChange({
      category: category === 'all' ? undefined : category,
      difficulty: difficulty === 'all' ? undefined : difficulty
    });
  }, [category, difficulty, onFilterChange]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <h3 className="font-semibold text-gray-900 mb-4">Filter Challenges</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', ...ChallengeConfig.CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {cat === 'all' ? 'All' : ChallengeConfig.getCategoryDisplayName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', ...ChallengeConfig.DIFFICULTY_LEVELS].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff as any)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  difficulty === diff
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {diff === 'all' ? 'All' : ChallengeConfig.getDifficultyDisplayName(diff)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Page Components

**Location:** `src/pages/`
**Purpose:** Top-level route components

**Characteristics:**
- ✅ One per route
- ✅ Compose layout + feature components
- ✅ Handle page-level state
- ✅ Minimal business logic (delegate to hooks/components)

**Example:**
```typescript
// Challenges.tsx
export default function Challenges() {
  const [filters, setFilters] = useState<ChallengeFilters>({});
  const { challenges, loading, error, refetch } = useChallenges(filters);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ErrorDisplay
          message={getUserFriendlyMessage(error)}
          onRetry={refetch}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <Container>
          <h1 className="text-5xl font-bold mb-4">Fitness Challenges</h1>
          <p className="text-xl text-blue-100">
            Choose from a variety of challenges to match your fitness goals
          </p>
        </Container>
      </section>

      {/* Filters */}
      <Container className="py-8">
        <ChallengeFilters onFilterChange={setFilters} />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{challenges.length}</span>{' '}
            {challenges.length === 1 ? 'challenge' : 'challenges'}
          </p>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <LoadingGrid count={6} />
        ) : challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No challenges found"
            description="Try adjusting your filters to see more results"
          />
        )}
      </Container>

      <Footer />
    </div>
  );
}
```

---

## Component Structure

### File Organization

```typescript
// ComponentName.tsx

// 1. Imports (ordered by import order rules)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeConfig } from '@/lib/config';
import { useChallenges } from '@/hooks/useChallenges';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import type { Challenge } from '@/types/challenge';

// 2. Type definitions
interface ChallengeCardProps {
  challenge: Challenge;
  onSelect?: (id: string) => void;
  className?: string;
}

// 3. Constants (if any)
const MAX_DESCRIPTION_LENGTH = 150;
const ANIMATION_DURATION = 200;

// 4. Helper functions (if any - prefer utils/ for reusable ones)
function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 5. Main component
export default function ChallengeCard({
  challenge,
  onSelect,
  className
}: ChallengeCardProps) {
  // a. Hooks (always first)
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  // b. Derived values
  const truncatedDesc = truncateDescription(
    challenge.description,
    MAX_DESCRIPTION_LENGTH
  );
  const canJoin = user && !challenge.participants.includes(user.id);

  // c. Event handlers
  const handleClick = () => {
    onSelect?.(challenge.id);
  };

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  // d. Effects
  useEffect(() => {
    // Log view
    if (user) {
      logChallengeView(challenge.id, user.id);
    }
  }, [challenge.id, user]);

  // e. Render
  return (
    <Card className={className} onClick={handleClick}>
      <h3>{challenge.title}</h3>
      <p>{isExpanded ? challenge.description : truncatedDesc}</p>
      {challenge.description.length > MAX_DESCRIPTION_LENGTH && (
        <button onClick={handleToggle}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {canJoin && <Button>Join Challenge</Button>}
    </Card>
  );
}

// 6. Sub-components (if small and tightly coupled)
function ChallengeStats({ participants }: { participants: number }) {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <UsersIcon className="w-4 h-4 mr-1" />
      {formatNumber(participants)} joined
    </div>
  );
}
```

---

## Props Patterns

### Basic Props

```typescript
// ✅ Good - Explicit interface
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({ children, onClick, disabled, variant = 'primary' }: ButtonProps) {
  return <button>{children}</button>;
}
```

### Extending HTML Attributes

```typescript
// ✅ Good - Extend native element props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(getVariantStyles(variant), getSizeStyles(size), className)}
      {...props}  // Spread remaining props (onClick, disabled, etc.)
    />
  );
}
```

### Children Patterns

```typescript
// Simple children
interface CardProps {
  children: ReactNode;
}

// Render prop pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: T, loading: boolean, error: Error | null) => ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, loading, error } = useFetch<T>(url);
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher url="/api/challenges">
  {(data, loading, error) => (
    loading ? <Spinner /> : <ChallengeList challenges={data} />
  )}
</DataFetcher>
```

### Optional Callbacks

```typescript
interface ComponentProps {
  onSuccess?: (data: Data) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

function Component({ onSuccess, onError, onComplete }: ComponentProps) {
  const handleSubmit = async () => {
    try {
      const result = await apiCall();
      onSuccess?.(result);  // Only call if defined
    } catch (error) {
      onError?.(error as Error);
    } finally {
      onComplete?.();
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Discriminated Unions for Props

```typescript
// ✅ Good - Type-safe variants
type ButtonProps =
  | {
      variant: 'link';
      href: string;
      onClick?: never;
    }
  | {
      variant: 'button';
      href?: never;
      onClick: () => void;
    };

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return <a href={props.href}>Link</a>;
  }

  return <button onClick={props.onClick}>Button</button>;
}
```

---

## State Management

### Local State

```typescript
// ✅ Good - Simple local state
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Derived State

```typescript
// ✅ Good - Derive don't store
function UserProfile({ user }: { user: User }) {
  // ❌ Bad - Don't store derived state
  // const [displayName, setDisplayName] = useState(user.name.toUpperCase());

  // ✅ Good - Compute on render
  const displayName = user.name.toUpperCase();
  const isAdmin = user.role === 'admin';
  const canEdit = isAdmin || user.id === currentUserId;

  return <div>{displayName}</div>;
}
```

### Complex State

```typescript
// ✅ Good - Use useReducer for complex state
type State = {
  data: Challenge[];
  loading: boolean;
  error: string | null;
  filters: ChallengeFilters;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Challenge[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: ChallengeFilters };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

function ChallengeList() {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: false,
    error: null,
    filters: {}
  });

  // Use dispatch for state updates
  dispatch({ type: 'FETCH_START' });
}
```

---

## Event Handling

### Click Handlers

```typescript
function Component() {
  // ✅ Good - useCallback for handlers passed as props
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  // ✅ Good - Inline for simple cases
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <button onClick={() => console.log('Simple')}>Simple</button>
    </div>
  );
}
```

### Form Handlers

```typescript
function Form() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle submission
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Debounced Handlers

```typescript
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## Conditional Rendering

### Simple Conditions

```typescript
// ✅ Good - && for simple conditions
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{user && <Welcome name={user.name} />}

// ✅ Good - Ternary for if/else
{isLoading ? <Spinner /> : <Content />}
{user ? <Dashboard /> : <Login />}
```

### Multiple Conditions

```typescript
// ✅ Good - Early returns
function Component({ data, loading, error }: Props) {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return <DataView data={data} />;
}
```

### Switch-like Rendering

```typescript
// ✅ Good - Object mapping
const StatusComponent = {
  idle: <Idle />,
  loading: <Loading />,
  success: <Success />,
  error: <Error />
};

function Component({ status }: { status: keyof typeof StatusComponent }) {
  return StatusComponent[status];
}
```

---

## Performance Optimization

### React.memo

```typescript
// ✅ Use memo for expensive components that re-render often
const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate
}: Props) {
  // Expensive rendering logic
  return <div>{/* complex UI */}</div>;
});

// ✅ Custom comparison function
const MemoizedComponent = memo(
  Component,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.id === nextProps.id;
  }
);
```

### useMemo

```typescript
function Component({ items }: { items: Item[] }) {
  // ✅ Good - Memoize expensive calculations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.priority - b.priority);
  }, [items]);

  const stats = useMemo(() => {
    return calculateComplexStats(items);
  }, [items]);

  return <div>{/* Use sortedItems and stats */}</div>;
}
```

### useCallback

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Good - Memoize callbacks passed to children
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}

const Child = memo(function Child({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click</button>;
});
```

---

## Accessibility

### Semantic HTML

```typescript
// ✅ Good - Use semantic elements
function Article() {
  return (
    <article>
      <header>
        <h1>Title</h1>
      </header>
      <main>
        <p>Content</p>
      </main>
      <footer>
        <p>Footer</p>
      </footer>
    </article>
  );
}
```

### ARIA Attributes

```typescript
function Button({ loading, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      aria-label="Submit form"
    >
      {loading ? 'Loading...' : 'Submit'}
    </button>
  );
}
```

### Keyboard Navigation

```typescript
function Modal({ isOpen, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <div role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}
```

---

## Testing Components

### Basic Test Structure

```typescript
// ChallengeCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ChallengeCard from './ChallengeCard';

describe('ChallengeCard', () => {
  const mockChallenge = {
    id: '1',
    title: 'Test Challenge',
    description: 'Test description',
    // ...
  };

  it('renders challenge title', () => {
    render(<ChallengeCard challenge={mockChallenge} />);
    expect(screen.getByText('Test Challenge')).toBeInTheDocument();
  });

  it('calls onJoin when join button is clicked', () => {
    const onJoin = jest.fn();
    render(<ChallengeCard challenge={mockChallenge} onJoin={onJoin} />);

    fireEvent.click(screen.getByText('Join Challenge'));
    expect(onJoin).toHaveBeenCalledWith('1');
  });
});
```

---

**Last Updated:** 2024-04-13
**Reference:** React Best Practices & NOVA Project Patterns
