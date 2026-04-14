# Troubleshooting Guide

Common issues and solutions for GlycoGrit development.

## Build Issues

### TypeScript Errors

**Issue:** `Cannot find module '@/lib/config'`
**Solution:**
```bash
# Check vite.config.js path aliases are configured
# Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Issue:** `Type 'X' is not assignable to type 'Y'`
**Solution:**
```typescript
// Check your type definitions
// Use type assertions only as last resort
const value = apiResponse as ExpectedType;
```

### Build Failures

**Issue:** Build works locally but fails on Vercel
**Solution:**
```bash
# Check Node version matches Vercel (20.x)
node -v

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run production build locally
npm run build
```

## Runtime Issues

### White Screen / Nothing Renders

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. React DevTools for component tree
4. Verify environment variables are set

### API Calls Failing

**Issue:** 404 or CORS errors
**Solution:**
```typescript
// Check API_URL environment variable
console.log(import.meta.env.VITE_API_URL);

// Verify API is running
curl https://api.glycogrit.com/health

// Check CORS headers in response
```

### Authentication Issues

**Issue:** User logged out unexpectedly
**Solution:**
```typescript
// Check token expiration
const token = AuthService.getToken();
if (token) {
  const decoded = decodeToken(token);
  console.log('Token expires:', new Date(decoded.exp * 1000));
}

// Clear localStorage if corrupted
localStorage.clear();
```

## Development Issues

### Hot Reload Not Working

**Solution:**
```bash
# Restart dev server
# Check vite.config.js for correct configuration
# Clear browser cache
```

### Slow Build Times

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Update dependencies
npm update

# Check for circular dependencies
npm run build -- --debug
```

## Deployment Issues

### Vercel Deployment Stuck

**Solution:**
1. Cancel deployment in dashboard
2. Push a new commit to retry
3. Check build logs for errors

### Domain Not Resolving

**Solution:**
```bash
# Check DNS propagation
dig glycogrit.com

# Flush local DNS cache
sudo dscacheutil -flushcache

# Wait up to 48 hours for propagation
```

## Getting Help

1. Check this troubleshooting guide
2. Search GitHub issues
3. Check Vercel logs
4. Ask team for help
5. Create detailed bug report

**Last Updated:** 2024-04-13
