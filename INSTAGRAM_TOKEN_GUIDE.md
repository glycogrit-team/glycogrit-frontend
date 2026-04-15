# Instagram Access Token - Simplified Guide

This is the **modern, simple approach** to get your Instagram photos loading on the gallery page.

## What You Need
- Your Facebook app is created: ✅ "GlycoGrit Website"
- App ID: `1242959884493260`
- Instagram business account: ✅ @glycogrit
- Facebook Page connected to your Instagram: ✅

## Step-by-Step: Get Your Access Token

### Step 1: Go to Graph API Explorer

Open this URL in a new tab:
https://developers.facebook.com/tools/explorer/

### Step 2: Configure the Explorer

1. **Select Your App**:
   - In the top-right, find the dropdown that says "Facebook App"
   - Select: **GlycoGrit Website**

2. **Select Your Facebook Page**:
   - Below the app selector, find "User or Page" dropdown
   - Select your Facebook Page (the one connected to @glycogrit Instagram)

3. **Add Permissions**:
   - Click the **"Permissions"** dropdown (or "Add a Permission" button)
   - Search for and add these permissions:
     - `instagram_basic`
     - `instagram_manage_insights` (optional, for analytics)
     - `pages_read_engagement`
     - `pages_show_list`
   - Click **"Generate Access Token"** button
   - A popup will appear - click **"Continue"** to authorize

4. **Copy the Access Token**:
   - You'll see a long string of text in the "Access Token" field
   - Copy this entire token (it starts with something like "EAAC...")
   - **This is a short-lived token (expires in 1 hour)**

### Step 3: Get Instagram Business Account ID

Before converting to a long-lived token, we need your Instagram Business Account ID:

1. In Graph API Explorer (same page)
2. In the text field next to "Submit", type: `me/accounts`
3. Click **Submit**
4. You'll see JSON response with your Facebook Pages
5. Find your page and copy the `id` value
6. Now type: `{PAGE_ID}?fields=instagram_business_account`
   - Replace `{PAGE_ID}` with the ID you just copied
7. Click **Submit**
8. Copy the `instagram_business_account.id` value - this is your Instagram Business Account ID

### Step 4: Convert to Long-Lived Token

Short-lived tokens expire in 1 hour. Convert yours to a long-lived token (60 days):

1. Open your terminal
2. Run this command (replace the values):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=1242959884493260&\
client_secret=YOUR_APP_SECRET&\
fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

**Where to find values:**
- `client_id`: `1242959884493260` (your App ID from settings)
- `client_secret`: Click "Show" next to "App secret" in your Basic Settings
- `fb_exchange_token`: The short-lived token you just copied from Graph API Explorer

3. The response will be:
```json
{
  "access_token": "EAAC...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

4. Copy the new `access_token` value - **this is your long-lived token!**

### Step 5: Test the Token

Test that your token works:

```bash
curl "https://graph.instagram.com/{INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?\
fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&\
limit=12&\
access_token=YOUR_LONG_LIVED_TOKEN"
```

Replace:
- `{INSTAGRAM_BUSINESS_ACCOUNT_ID}`: The ID from Step 3
- `YOUR_LONG_LIVED_TOKEN`: Your long-lived token from Step 4

If you see JSON with your Instagram posts, it works! 🎉

### Step 6: Add Token to Doppler

Now add your token to Doppler for all environments:

```bash
cd /Users/ygahlot/mac-one-Personal-projects/runnersParadise/glycogrit-frontend

# For development
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config dev

# For staging
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config stg

# For production
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config prd
```

### Step 7: Test Locally

```bash
npm run dev
```

Navigate to `http://localhost:5173/gallery` and you should see your Instagram photos! 🎉

## Important Notes

### Token Expiration

Long-lived tokens expire after 60 days. To refresh:

```bash
curl "https://graph.instagram.com/refresh_access_token?\
grant_type=ig_refresh_token&\
access_token=YOUR_CURRENT_LONG_LIVED_TOKEN"
```

Set a reminder to refresh every 50 days.

### Rate Limits

- 200 calls per hour per user
- This is more than enough for a website gallery

## Troubleshooting

### "Invalid OAuth access token"
- Your token expired - generate a new one following Steps 1-4

### "Instagram account not found"
- Make sure your Instagram is a Business account
- Verify it's connected to your Facebook Page
- Go to Instagram Settings → Account → Switch to Professional Account

### "Permissions error"
- Regenerate token with correct permissions in Step 2

### CORS errors
- Instagram Graph API supports CORS from browsers
- If you see CORS errors, check that your token is valid

## Alternative: Using Instagram Business Account Settings

If Graph API Explorer doesn't work, you can also get tokens from:

1. Go to your Facebook Page Settings
2. Click **Instagram** in the left sidebar
3. Make sure your Instagram account is connected
4. The process is similar but through the Page interface

## Need Help?

If you're stuck at any step, share:
1. Which step you're on
2. Any error messages you see
3. Screenshot of the issue

Your photos will be loading soon! 📸
