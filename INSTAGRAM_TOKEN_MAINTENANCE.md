# Instagram Access Token Maintenance

## Current Token Details

- **Token Type**: Long-lived User Access Token
- **Created**: April 15, 2026
- **Expires**: ~June 14, 2026 (60 days from creation)
- **Storage**: Doppler (dev, stg, prd environments)
- **Environment Variable**: `VITE_INSTAGRAM_ACCESS_TOKEN`

## Token Value (for reference)

```
EAARqdyZAiocwBRNC8syObBKoN3ZCuZAsPhuWZBJcuuTecdepYLJXsuMZAAVikreV3UBy8UhBZAMpS0nHzavsC683pSX5cnsWGX5Ix0lywLLvYsX1QsoX02KuhZAHBnzFNlKLwc8GPmbDYm6h1jHBfUJlj73QmyjfnNoaM6s3kC4P44kuoo6CX2VfPYj5k2U3IrlUJniLpUkkHWJ
```

## ⏰ Important Reminders

### Set Calendar Reminders

Add these to your calendar:

1. **June 1, 2026** - Warning: Token expires in 2 weeks
2. **August 1, 2026** - Warning: Time to refresh token again (after June refresh)
3. **Every 50-55 days** - Recurring reminder to refresh token

## 🔄 How to Refresh the Token

Long-lived tokens expire after 60 days. Refresh your token BEFORE it expires using this command:

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=EAARqdyZAiocwBRNC8syObBKoN3ZCuZAsPhuWZBJcuuTecdepYLJXsuMZAAVikreV3UBy8UhBZAMpS0nHzavsC683pSX5cnsWGX5Ix0lywLLvYsX1QsoX02KuhZAHBnzFNlKLwc8GPmbDYm6h1jHBfUJlj73QmyjfnNoaM6s3kC4P44kuoo6CX2VfPYj5k2U3IrlUJniLpUkkHWJ"
```

### Expected Response

```json
{
  "access_token": "NEW_LONG_LIVED_TOKEN...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

### After Refreshing

1. Copy the new `access_token` value
2. Update Doppler secrets:

```bash
cd /Users/ygahlot/mac-one-Personal-projects/runnersParadise/glycogrit-frontend

# Update dev
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="NEW_TOKEN_HERE" --config dev

# Update staging
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="NEW_TOKEN_HERE" --config stg

# Update production
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="NEW_TOKEN_HERE" --config prd
```

3. Update this file with new token details:
   - Update "Current Token Details" section with new creation and expiry dates
   - Update "Token Value" section with new token
   - Update the refresh command with new token

## 🚨 What Happens If Token Expires?

If the token expires:

1. The Gallery page will show a fallback message with a CTA to visit Instagram
2. Users can still click through to see your Instagram profile
3. No photos will load automatically

To fix:

1. Generate a new long-lived token (see [INSTAGRAM_TOKEN_GUIDE.md](./INSTAGRAM_TOKEN_GUIDE.md))
2. Update Doppler secrets with new token
3. Redeploy if necessary (dev server will pick it up automatically)

## 📝 Token Refresh History

Keep track of token refreshes:

| Date | Action | New Expiry | Notes |
|------|--------|------------|-------|
| 2026-04-15 | Initial token created | ~2026-06-14 | Long-lived token from Graph API |
| | | | |
| | | | |

## 🔐 Facebook App Details

- **App Name**: GlycoGrit Website
- **App ID**: 1242959884493260
- **App Secret**: (stored securely, check Facebook Developer Portal)
- **Instagram Account**: @glycogrit
- **Instagram Business Account ID**: (find using Graph API Explorer)

## 📚 Additional Resources

- [Facebook Graph API Token Documentation](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [INSTAGRAM_TOKEN_GUIDE.md](./INSTAGRAM_TOKEN_GUIDE.md) - Full setup guide
- [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md) - Alternative setup methods

## ⚠️ Security Best Practices

1. **Never commit tokens to Git** - Always use Doppler for secrets
2. **Rotate tokens regularly** - Even if not expired, consider rotating every 45-50 days
3. **Monitor token usage** - Check Facebook Developer portal for API usage
4. **Keep App Secret secure** - Never share or commit the App Secret
5. **Use different tokens per environment** - Currently using same token for all environments (acceptable for now)

## 🛠️ Troubleshooting

### Token Not Working

```bash
# Test the token
curl "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN"
```

If you get an error:
1. Token might be expired - refresh it
2. Token might be invalid - generate a new one
3. Permissions might be wrong - regenerate with correct permissions

### Need to Generate Fresh Token

Follow the complete guide in [INSTAGRAM_TOKEN_GUIDE.md](./INSTAGRAM_TOKEN_GUIDE.md)
