# Styling Guide

Complete guide to styling in GlycoGrit using Tailwind CSS.

## Tailwind CSS Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... custom colors
        }
      }
    }
  }
}
```

## Utility Classes

### Layout
```tsx
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="flex items-center justify-between">
      {/* Content */}
    </div>
  </div>
</div>
```

### Responsive Design
```tsx
<div className="text-sm md:text-base lg:text-lg">
  {/* Responsive text */}
</div>
```

### Custom Utilities
```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  'base-styles',
  condition && 'conditional-styles',
  className
)} />
```

## Component Styling Patterns

### Variant-based Styling
```typescript
const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border-2 border-primary-600 text-primary-600'
};

function Button({ variant = 'primary' }) {
  return (
    <button className={cn('px-4 py-2 rounded-lg', buttonVariants[variant])}>
      Click me
    </button>
  );
}
```

## Best Practices

1. **Use Tailwind utilities first**
2. **Extract repeated patterns to components**
3. **Use the `cn()` utility for conditional classes**
4. **Follow mobile-first approach**
5. **Keep custom CSS minimal**

**Last Updated:** 2024-04-13
