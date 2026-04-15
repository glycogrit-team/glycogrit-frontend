# Get Correct Instagram Business Account Token

## The Problem

The token we generated is a Facebook User Token, but we need an **Instagram Business Account token** to access Instagram media.

## Solution: Use Graph API Explorer

### Step 1: Open Graph API Explorer

Go to: https://developers.facebook.com/tools/explorer/

### Step 2: Configure Graph API Explorer

1. **Select Your App**:
   - Top right dropdown: Select "GlycoGrit Website"

2. **Generate Access Token**:
   - Click "Generate Access Token" button
   - In the permissions dialog, add these permissions:
     - `instagram_basic`
     - `instagram_content_publish` (optional)
     - `pages_show_list`
     - `pages_read_engagement`
   - Click "Generate Access Token"
   - Click "Continue" when asked to authorize

3. **Copy the Access Token**:
   - You'll see a token in the "Access Token" field
   - This is a short-lived **Page Access Token**

### Step 3: Get Your Instagram Business Account ID

1. In the Graph API Explorer query field, enter:
   ```
   me/accounts
   ```

2. Click "Submit"

3. Find your Facebook Page in the response (look for the one connected to @glycogrit)

4. Copy the `id` value for your page

5. Now query for Instagram Business Account:
   ```
   {PAGE_ID}?fields=instagram_business_account
   ```
   Replace `{PAGE_ID}` with the ID you copied

6. Click "Submit"

7. You'll see a response like:
   ```json
   {
     "instagram_business_account": {
       "id": "17841XXXXXXXXXX"
     },
     "id": "PAGE_ID"
   }
   ```

8. Copy the `instagram_business_account.id` value

### Step 4: Test the Token

Test that you can fetch Instagram media:

```bash
curl "https://graph.instagram.com/{INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=12&access_token=YOUR_SHORT_LIVED_TOKEN"
```

Replace:
- `{INSTAGRAM_BUSINESS_ACCOUNT_ID}` with the ID from Step 3
- `YOUR_SHORT_LIVED_TOKEN` with the token from Step 2

If this works, you'll see JSON with your Instagram posts!

### Step 5: Convert to Long-Lived Page Access Token

Run this command:

```bash
curl -G "https://graph.facebook.com/v18.0/oauth/access_token" \
  --data-urlencode "grant_type=fb_exchange_token" \
  --data-urlencode "client_id=1242959884493260" \
  --data-urlencode "client_secret=a54f5f56bd1f26857916c569aeb2a743" \
  --data-urlencode "fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

### Step 6: Update Doppler

Once you have the long-lived token, update Doppler:

```bash
cd /Users/ygahlot/mac-one-Personal-projects/runnersParadise/glycogrit-frontend

doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config dev
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config stg
doppler secrets set VITE_INSTAGRAM_ACCESS_TOKEN="YOUR_LONG_LIVED_TOKEN" --config prd
```

## Alternative: Check if Instagram is Connected to Facebook Page

If the above doesn't work, you need to connect your Instagram Business Account to a Facebook Page:

1. Go to your Instagram app
2. Settings → Account → Linked Accounts
3. Connect to Facebook Page
4. Or go to your Facebook Page Settings → Instagram → Connect Account

## Need Help?

Share:
1. Screenshot of Graph API Explorer after clicking "Generate Access Token"
2. The response from `me/accounts` query
3. Any error messages you see
