# Instagram API Setup Guide

This guide will help you obtain an Instagram Access Token to display your Instagram photos on the Gallery page.

## Prerequisites

- Instagram Business or Creator Account (you mentioned you have this)
- Facebook Page connected to your Instagram account
- Facebook Developer Account

## Option 1: Using Facebook Graph API Explorer (Recommended)

### Step 1: Connect Instagram to Facebook Page

1. Go to your Instagram app settings
2. Navigate to **Account** → **Linked Accounts**
3. Connect your Instagram to a Facebook Page (if not already connected)

### Step 2: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** as app type
4. Fill in app details:
   - App Name: "GlycoGrit Website"
   - Contact Email: Your email
5. Click **Create App**

### Step 3: Add Instagram Basic Display

1. In your app dashboard, click **Add Product**
2. Find **Instagram Basic Display** and click **Set Up**
3. Click **Create New App** (at the bottom of the settings page)
4. Add OAuth Redirect URIs: `https://localhost/` (for testing)
5. Deauthorize Callback URL: `https://localhost/` (for testing)
6. Data Deletion Request URL: `https://localhost/` (for testing)
7. Click **Save Changes**

### Step 4: Add Instagram Tester

1. Scroll down to **User Token Generator**
2. Click **Add or Remove Instagram Testers**
3. This opens Instagram → Go to **Apps and Websites**
4. Under **Tester Invites**, accept the invitation

### Step 5: Generate Access Token

1. Back in Facebook Developer Portal, under **User Token Generator**
2. Click **Generate Token** next to your Instagram account
3. Click **Continue** to authorize
4. Copy the **Access Token** (it starts with "IGQV..." or similar)

### Step 6: Get Long-Lived Token

Short-lived tokens expire in 1 hour. Convert to long-lived (60 days):

```bash
curl -X GET \
  "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
```

Replace:
- `YOUR_APP_SECRET`: Found in **Settings** → **Basic** in your Facebook App
- `SHORT_LIVED_TOKEN`: The token you just copied

The response will contain your long-lived token:
```json
{
  "access_token": "IGQV...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

## Option 2: Instagram Business Account (Simpler)

If the above seems complex, you can use Instagram Graph API with your business account:

### Requirements
- Instagram Business Account
- Facebook Page linked to Instagram
- Facebook Developer Account

### Steps

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app (as above)
3. Add **Instagram Graph API** product
4. Use **Graph API Explorer**:
   - Select your Facebook Page
   - Add permissions: `instagram_basic`, `pages_read_engagement`
   - Generate Access Token
5. Test the token:
   ```bash
   curl "https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption&access_token=YOUR_TOKEN"
   ```

## Adding Token to Your Project

Once you have your long-lived access token:

### For Local Development

1. Open your terminal in the project directory
2. Run:
   ```bash
   cd glycogrit-frontend
   doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config dev
   ```

### For Staging

```bash
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config stg
```

### For Production

```bash
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config prd
```

## Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Gallery page
3. You should see your Instagram photos loading in a grid

## Token Refresh

Long-lived tokens expire after 60 days. To refresh:

```bash
curl -X GET \
  "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN"
```

Set up a reminder to refresh the token every 50 days, or implement automatic refresh in your backend.

## Troubleshooting

### Photos Not Loading

1. Check browser console for errors
2. Verify token in Doppler:
   ```bash
   doppler secrets get VITE_INSTAGRAM_ACCESS_TOKEN --config dev
   ```
3. Test token manually:
   ```bash
   curl "https://graph.instagram.com/me/media?fields=id&access_token=YOUR_TOKEN"
   ```

### Token Expired

If you see "Invalid OAuth access token", your token has expired. Follow the refresh steps above.

### CORS Errors

Instagram Graph API supports CORS from browsers, so this shouldn't be an issue. If you see CORS errors, verify:
- Your token is correct
- Your app is in Live mode (not Development mode)

## Security Notes

- Never commit access tokens to Git
- Always store tokens in Doppler (not in .env files)
- Rotate tokens periodically
- Use environment-specific tokens (different for dev/stg/prd if needed)

## Need Help?

If you encounter issues:
1. Check Facebook Developer Documentation: https://developers.facebook.com/docs/instagram-basic-display-api
2. Verify your Instagram account is a Business or Creator account
3. Ensure Facebook Page is properly linked
