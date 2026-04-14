# Security Best Practices

This document outlines security best practices for the GlycoGrit project, covering authentication, authorization, data protection, and common vulnerability prevention.

## Table of Contents
- [Overview](#overview)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [XSS Prevention](#xss-prevention)
- [CSRF Protection](#csrf-protection)
- [API Security](#api-security)
- [Environment & Secrets Management](#environment--secrets-management)
- [Dependency Security](#dependency-security)
- [Content Security Policy](#content-security-policy)
- [Security Headers](#security-headers)
- [Secure Coding Practices](#secure-coding-practices)

---

## Overview

**Security Principles:**
1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum necessary permissions
3. **Secure by Default** - Security built-in, not bolted-on
4. **Zero Trust** - Never trust, always verify
5. **Fail Securely** - Errors should not expose sensitive data

**Threat Model:**
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- SQL Injection (if using database)
- Authentication bypass
- Unauthorized data access
- Man-in-the-middle attacks
- Dependency vulnerabilities

---

## Authentication & Authorization

### Token-Based Authentication

**Implementation Pattern:**
```typescript
// lib/auth.ts
export class AuthService {
  private static TOKEN_KEY = 'auth_token';

  static setToken(token: string): void {
    // Use httpOnly cookies in production for better security
    // For now, using localStorage with proper XSS protection
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Verify token is not expired
    try {
      const payload = this.decodeToken(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private static decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
```

### Secure Token Storage

**Options:**

**1. HTTP-Only Cookies (Recommended for Production)**
```typescript
// Backend sets cookie
response.cookie('auth_token', token, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000      // 1 hour
});
```

**Pros:**
- ✅ Not accessible via JavaScript (XSS protection)
- ✅ Automatically sent with requests
- ✅ Can be secured with httpOnly, secure, sameSite flags

**Cons:**
- ❌ Requires backend support
- ❌ More complex CORS setup

**2. localStorage (Current Implementation)**
```typescript
localStorage.setItem('auth_token', token);
```

**Pros:**
- ✅ Simple to implement
- ✅ Works with any backend
- ✅ Flexible client-side management

**Cons:**
- ❌ Vulnerable to XSS if not properly sanitized
- ❌ Accessible via JavaScript

**Best Practice:** Use httpOnly cookies for production, localStorage only for development.

### Authorization Patterns

**Route Protection:**
```typescript
// components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Usage in App.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**Role-Based Access Control:**
```typescript
// lib/auth.ts
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export class AuthService {
  static hasRole(requiredRole: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.MODERATOR]: 2,
      [UserRole.USER]: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}

// Component usage
function AdminPanel() {
  if (!AuthService.hasRole(UserRole.ADMIN)) {
    return <Navigate to="/unauthorized" />;
  }

  return <div>Admin Content</div>;
}
```

### Secure Password Handling

**Never store passwords in plain text!**

**Client-side validation:**
```typescript
// utils/validation.ts
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Must contain number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Must contain special character');
  }

  const strength = errors.length === 0
    ? password.length >= 12 ? 'strong' : 'medium'
    : 'weak';

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}
```

**Backend responsibility:**
- Hash passwords with bcrypt, argon2, or scrypt
- Use salt (automatic with bcrypt)
- Never log passwords
- Implement rate limiting on login endpoints

---

## Data Protection

### Sensitive Data Handling

**DO ✅:**
```typescript
// Never log sensitive data
console.log('User logged in:', { id: user.id, email: user.email });

// Mask sensitive data in UI
const maskedCard = `****-****-****-${card.slice(-4)}`;
const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
```

**DON'T ❌:**
```typescript
// Never log passwords, tokens, or credit cards
console.log('Password:', password);           // BAD!
console.log('Token:', authToken);             // BAD!
console.log('Card:', creditCardNumber);       // BAD!

// Never store sensitive data in localStorage
localStorage.setItem('password', password);   // BAD!
localStorage.setItem('ssn', ssn);            // BAD!
```

### Data Encryption

**In Transit:**
- **Always use HTTPS** (enforced by Vercel)
- Verify SSL certificates
- Use secure WebSocket connections (wss://)

**At Rest:**
- Encrypt sensitive data before storing
- Use environment variables for encryption keys
- Never commit encryption keys to git

```typescript
// Example: Simple encryption wrapper
import CryptoJS from 'crypto-js';

export class SecureStorage {
  private static ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

  static setSecure(key: string, value: string): void {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      this.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encrypted);
  }

  static getSecure(key: string): string | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        this.ENCRYPTION_KEY
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  }
}
```

### Personal Identifiable Information (PII)

**PII includes:**
- Name, email, phone number
- Address, ZIP code
- Social Security Number
- Credit card information
- IP addresses
- Biometric data

**Handling PII:**
```typescript
// ✅ Good - Minimize PII collection
interface UserProfile {
  id: string;
  username: string;
  email: string;  // Only if necessary
  // Avoid collecting: SSN, full address, etc.
}

// ✅ Good - Sanitize before logging
function sanitizeForLogging(user: User) {
  return {
    id: user.id,
    username: user.username,
    // email removed from logs
  };
}

console.log('User action:', sanitizeForLogging(user));
```

---

## XSS Prevention

### What is XSS?
Cross-Site Scripting allows attackers to inject malicious scripts into web pages viewed by other users.

### React's Built-in Protection

React automatically escapes values in JSX:
```typescript
// ✅ Safe - React escapes this
const userInput = '<script>alert("XSS")</script>';
return <div>{userInput}</div>;
// Renders as text, not executed
```

### Dangerous Patterns to Avoid

**dangerouslySetInnerHTML:**
```typescript
// ❌ DANGEROUS - Never use with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe - Sanitize first
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

**Dynamic Script Injection:**
```typescript
// ❌ DANGEROUS
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);

// ✅ Safe - Never execute user input as code
// Use data-driven approaches instead
```

### Input Sanitization

```typescript
// utils/sanitize.ts
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function sanitizeUrl(url: string): string {
  // Only allow http(s) and relative URLs
  const allowedProtocols = ['http:', 'https:', '/'];
  try {
    const parsed = new URL(url, window.location.origin);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '/';
    }
    return url;
  } catch {
    return '/';
  }
}

// Usage
<a href={sanitizeUrl(userProvidedUrl)}>Link</a>
```

### Content Validation

```typescript
// Validate user input before processing
export function validateInput(input: string): boolean {
  // Check for script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input)) {
    return false;
  }

  // Check for event handlers
  if (/on\w+\s*=/gi.test(input)) {
    return false;
  }

  // Check for javascript: protocol
  if (/javascript:/gi.test(input)) {
    return false;
  }

  return true;
}
```

---

## CSRF Protection

### What is CSRF?
Cross-Site Request Forgery tricks users into executing unwanted actions on authenticated sites.

### SameSite Cookies
```typescript
// Backend sets SameSite attribute
response.cookie('auth_token', token, {
  sameSite: 'strict',  // or 'lax'
  secure: true,
  httpOnly: true
});
```

### CSRF Tokens

```typescript
// lib/csrf.ts
export class CSRFProtection {
  private static TOKEN_HEADER = 'X-CSRF-Token';

  static generateToken(): string {
    return crypto.randomUUID();
  }

  static setToken(token: string): void {
    sessionStorage.setItem('csrf_token', token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  }

  static addTokenToRequest(headers: Headers): Headers {
    const token = this.getToken();
    if (token) {
      headers.set(this.TOKEN_HEADER, token);
    }
    return headers;
  }
}

// API client integration
async function apiRequest(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  CSRFProtection.addTokenToRequest(headers);

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'  // Send cookies
  });
}
```

### Double Submit Cookie Pattern

```typescript
// Set CSRF token in both cookie and header
function makeSecureRequest(url: string, data: any) {
  const csrfToken = getCookie('csrf_token');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
}
```

---

## API Security

### Secure API Calls

```typescript
// lib/api-client.ts
export class GlycogritAPIClient {
  private baseUrl: string;
  private timeout: number;

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // 1. Add authentication
    const headers = new Headers(options.headers);
    const token = AuthService.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. Add CSRF protection
    CSRFProtection.addTokenToRequest(headers);

    // 3. Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // 4. Make request
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include'  // Send cookies
      });

      clearTimeout(timeoutId);

      // 5. Verify response
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  private async handleErrorResponse(response: Response): Promise<APIError> {
    // Don't expose internal error details
    const safeMessage = this.getSafeErrorMessage(response.status);
    return new APIError(safeMessage, response.status);
  }

  private getSafeErrorMessage(status: number): string {
    // Don't expose implementation details
    switch (status) {
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Too many requests. Please try again later';
      case 500:
        return 'Server error. Please try again';
      default:
        return 'An error occurred';
    }
  }
}
```

### Rate Limiting (Client-side)

```typescript
// lib/rate-limiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

// Usage
const limiter = new RateLimiter(5, 60000); // 5 requests per minute

async function apiCall(endpoint: string) {
  if (!limiter.canMakeRequest(endpoint)) {
    throw new Error('Rate limit exceeded');
  }

  return fetch(endpoint);
}
```

### Input Validation

```typescript
// Validate all inputs before sending to API
export function validateChallengeInput(data: CreateChallengeInput): void {
  if (!data.title || data.title.length < 3) {
    throw new ValidationError('Title must be at least 3 characters');
  }

  if (data.title.length > 100) {
    throw new ValidationError('Title must not exceed 100 characters');
  }

  if (!ChallengeConfig.CATEGORIES.includes(data.category)) {
    throw new ValidationError('Invalid category');
  }

  // Sanitize HTML in description
  data.description = sanitizeHtml(data.description);
}
```

---

## Environment & Secrets Management

### Environment Variables

**DO ✅:**
```bash
# .env.local (never committed)
VITE_API_URL=https://api.glycogrit.com
VITE_APP_NAME=GlycoGrit

# Vercel Dashboard only
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key
```

**DON'T ❌:**
```bash
# ❌ Never commit secrets to git
VITE_STRIPE_SECRET_KEY=sk_test_...  # Exposed to client!
VITE_DATABASE_PASSWORD=password123   # Exposed to client!
```

### Client vs Server Variables

**Client-exposed (VITE_ prefix):**
- API URLs
- Public keys
- Feature flags
- App configuration

**Server-only (no VITE_ prefix):**
- Database credentials
- API secrets
- Private keys
- Encryption keys

### Secrets Management

**1. Use Environment Variables**
```typescript
// ✅ Good
const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;

// ❌ Bad
const apiKey = 'hardcoded-api-key-12345';
```

**2. Never Commit Secrets**
```bash
# .gitignore
.env.local
.env.*.local
*.key
*.pem
secrets/
```

**3. Rotate Secrets Regularly**
- Change API keys every 90 days
- Rotate JWT secrets periodically
- Update after team member changes

**4. Use Secret Management Services**
- Vercel Environment Variables
- AWS Secrets Manager
- HashiCorp Vault
- 1Password Secrets Automation

---

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Automated Security Scanning

**GitHub Dependabot:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Safe Package Installation

```bash
# ✅ Good - Install exact version
npm install react@18.2.0 --save-exact

# ✅ Good - Verify package
npm view react@18.2.0

# ❌ Bad - Install without verification
npm install random-package
```

### Package Verification

Before installing a package:
1. Check npm downloads and stars
2. Review GitHub repository
3. Check last update date
4. Review security advisories
5. Scan with `npm audit`

---

## Content Security Policy

### CSP Headers

Add to Vercel configuration:

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.glycogrit.com"
        }
      ]
    }
  ]
}
```

### CSP Directives

```
default-src 'self'                         # Default policy
script-src 'self' https://trusted-cdn.com  # Scripts
style-src 'self' 'unsafe-inline'          # Styles
img-src 'self' data: https:               # Images
font-src 'self' data:                     # Fonts
connect-src 'self' https://api.glycogrit.com  # AJAX, WebSocket
frame-ancestors 'none'                    # Prevent framing
base-uri 'self'                           # Base URL restriction
form-action 'self'                        # Form submission
```

---

## Security Headers

### Required Security Headers

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### Header Explanations

**X-Frame-Options:**
- Prevents clickjacking attacks
- `DENY` - Cannot be framed
- `SAMEORIGIN` - Can only be framed by same origin

**X-Content-Type-Options:**
- Prevents MIME type sniffing
- `nosniff` - Browser must respect Content-Type

**X-XSS-Protection:**
- Legacy XSS protection (use CSP instead)
- `1; mode=block` - Enable and block on detection

**Referrer-Policy:**
- Controls referrer information
- `strict-origin-when-cross-origin` - Send origin only on HTTPS→HTTP

**Strict-Transport-Security (HSTS):**
- Forces HTTPS
- `max-age=31536000` - One year
- `includeSubDomains` - Apply to all subdomains

---

## Secure Coding Practices

### Input Validation

```typescript
// ✅ Always validate and sanitize user input
function createChallenge(data: unknown) {
  // 1. Type validation
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('Invalid data');
  }

  // 2. Schema validation
  const validated = ChallengeSchema.parse(data);

  // 3. Business logic validation
  if (validated.startDate < new Date()) {
    throw new ValidationError('Start date must be in the future');
  }

  // 4. Sanitization
  validated.title = sanitizeHtml(validated.title);

  return validated;
}
```

### Output Encoding

```typescript
// Always encode output based on context
function renderUserContent(content: string): string {
  // HTML context
  const htmlEncoded = encodeHTML(content);

  // URL context
  const urlEncoded = encodeURIComponent(content);

  // JavaScript context
  const jsEncoded = JSON.stringify(content);

  return htmlEncoded;
}
```

### Error Handling

```typescript
// ✅ Good - Safe error messages
try {
  await deleteUser(userId);
} catch (error) {
  // Don't expose internal details
  logError(error);  // Log full error server-side
  throw new Error('Unable to delete user');  // Generic message to client
}

// ❌ Bad - Exposing internals
try {
  await deleteUser(userId);
} catch (error) {
  throw new Error(`Database error: ${error.message}`);  // Exposes DB details!
}
```

### Least Privilege

```typescript
// Only request permissions you need
function UserProfile() {
  // ✅ Good - Minimal data
  const { name, email } = useUser();

  // ❌ Bad - Requesting everything
  const user = useUser(); // Contains: password hash, SSN, etc.
}
```

---

## Security Checklist

### Development
- [ ] All user inputs validated and sanitized
- [ ] No sensitive data in console.logs
- [ ] No hardcoded secrets or API keys
- [ ] XSS prevention measures in place
- [ ] CSRF protection implemented
- [ ] Authentication/authorization working
- [ ] HTTPS enforced
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit)

### Deployment
- [ ] Environment variables configured
- [ ] Security headers configured
- [ ] CSP policy set
- [ ] SSL certificate valid
- [ ] Error messages sanitized
- [ ] Rate limiting in place
- [ ] Monitoring and logging active
- [ ] Backup and recovery plan

### Post-Deployment
- [ ] Regular security audits
- [ ] Dependency updates automated
- [ ] Penetration testing completed
- [ ] Incident response plan documented
- [ ] Team trained on security practices

---

**Last Updated:** 2024-04-13
**Security Standard:** OWASP Top 10
**Compliance:** GDPR, CCPA (if applicable)
