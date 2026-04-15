# Meta App Configuration URLs

These URLs are required for your Meta (Facebook) App configuration to make your Instagram integration live.

## Production URLs

Once deployed to https://www.glycogrit.com, use these URLs in your Meta App settings:

### Privacy Policy URL
```
https://www.glycogrit.com/privacy-policy
```

### Terms of Service URL
```
https://www.glycogrit.com/terms-of-service
```

### User Data Deletion Instructions URL
```
https://www.glycogrit.com/data-deletion
```

## How to Update Meta App

1. Go to your Meta App Dashboard:
   - https://developers.facebook.com/apps/1653110126024804/

2. Navigate to **App Settings → Basic**

3. Fill in the required URLs:
   - **Privacy Policy URL**: https://www.glycogrit.com/privacy-policy
   - **Terms of Service URL**: https://www.glycogrit.com/terms-of-service
   - **User Data Deletion Callback URL**: https://www.glycogrit.com/data-deletion

4. Save changes

5. Submit your app for review to switch from Development to Live mode

## Vercel Deployment

The site is deployed on Vercel with automatic deployments from the `master` branch.

If the pages are not accessible after push:
1. Check Vercel dashboard: https://vercel.com/
2. Verify latest deployment completed successfully
3. Wait 2-3 minutes for cache to clear
4. Try accessing pages in an incognito window to bypass browser cache

## Testing Pages

Local Development:
- http://localhost:5175/privacy-policy
- http://localhost:5175/terms-of-service
- http://localhost:5175/data-deletion

Production:
- https://www.glycogrit.com/privacy-policy
- https://www.glycogrit.com/terms-of-service
- https://www.glycogrit.com/data-deletion

## Routes Configuration

All pages are configured with client-side routing in:
- `src/App.tsx` - Route definitions
- `vercel.json` - Rewrite rules for SPA routing

## Troubleshooting

If pages return 404:
1. Check if `vercel.json` has the correct rewrite configuration
2. Ensure the build completed successfully (check Vercel logs)
3. Clear browser cache or test in incognito mode
4. Verify routes are correctly defined in `src/App.tsx`
5. Check Vercel deployment logs for any errors

## App Information

- **App Name**: Glycogrit Social / GlycoGrit Website
- **App ID**: 1653110126024804
- **Instagram Account**: @glycogrit
- **Domain**: https://www.glycogrit.com
