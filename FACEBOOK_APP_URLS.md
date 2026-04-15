# Facebook App Configuration URLs

## For Instagram Basic Display / Graph API Setup

When configuring your Facebook App for Instagram integration, use these URLs:

### 1. Terms of Service URL
```
https://glycogrit.com/terms-of-service
```

**What this is:** Legal document outlining the terms and conditions for using GlycoGrit services.

**Where to use it:**
- Facebook App Settings > Basic > Terms of Service URL
- Instagram Basic Display API configuration
- App Review submissions

---

### 2. Data Deletion Instructions URL
```
https://glycogrit.com/data-deletion
```

**What this is:** Instructions for users on how to request deletion of their data from GlycoGrit.

**Where to use it:**
- Facebook App Settings > Basic > User Data Deletion > Data Deletion Instructions URL
- Required for Instagram Graph API compliance
- App Review submissions

---

### 3. Privacy Policy URL
```
https://glycogrit.com/privacy-policy
```

**What this is:** Document explaining how GlycoGrit collects, uses, and protects user data.

**Where to use it:**
- Facebook App Settings > Basic > Privacy Policy URL
- Required for all Facebook/Instagram integrations
- App Review submissions

---

## How to Add These to Your Facebook App

### Step 1: Go to Facebook Developer Portal
1. Visit: https://developers.facebook.com/apps
2. Select your app: **GlycoGrit Website** (App ID: 1242959884493260)

### Step 2: Configure Basic Settings
1. Click **Settings** > **Basic** in the left sidebar
2. Scroll to **Privacy Policy URL**
   - Enter: `https://glycogrit.com/privacy-policy`
3. Scroll to **Terms of Service URL**
   - Enter: `https://glycogrit.com/terms-of-service`
4. Scroll to **User Data Deletion**
   - Select "Data Deletion Instructions URL"
   - Enter: `https://glycogrit.com/data-deletion`
5. Click **Save Changes** at the bottom

### Step 3: Verify URLs Are Accessible
Before submitting for App Review, verify all URLs:
- ✅ https://glycogrit.com/privacy-policy
- ✅ https://glycogrit.com/terms-of-service
- ✅ https://glycogrit.com/data-deletion

All URLs should:
- Load successfully (200 OK status)
- Display the complete policy/instructions
- Be accessible without login
- Work on both desktop and mobile

---

## Quick Copy-Paste Reference

For easy copy-pasting during app configuration:

| Field | URL |
|-------|-----|
| Privacy Policy | https://glycogrit.com/privacy-policy |
| Terms of Service | https://glycogrit.com/terms-of-service |
| Data Deletion Instructions | https://glycogrit.com/data-deletion |

---

## Additional URLs You Might Need

### Website URL
```
https://glycogrit.com
```
Use this for the main **App Domains** or **Site URL** field.

### Contact Email
```
privacy@glycogrit.com
support@glycogrit.com
```
Use these for contact information in the app settings.

### Instagram Account
```
@glycogrit
```
The Instagram business account connected to your app.

---

## Important Notes

### Before Going Live
- [ ] Ensure all URLs are accessible on production (glycogrit.com)
- [ ] Test URLs on mobile and desktop browsers
- [ ] Verify content is complete and professionally written
- [ ] Check for any broken links within the policy pages
- [ ] Ensure contact information is correct and monitored

### For App Review
When submitting your app for Facebook/Instagram review:
1. These URLs will be automatically checked by Facebook reviewers
2. All URLs must return 200 OK status (no 404s or redirects)
3. Content must be relevant and comprehensive
4. Pages must load quickly and be mobile-friendly

### Data Deletion Compliance
Facebook requires a clear data deletion mechanism. Your current setup provides:
- ✅ Email contact: privacy@glycogrit.com
- ✅ WhatsApp contact: +91 98765 43210
- ✅ Clear step-by-step instructions
- ✅ 30-day deletion timeline
- ✅ Information about what data is deleted

---

## Troubleshooting

### URL Returns 404
- Check that the app is deployed to https://glycogrit.com
- Verify routing is configured correctly in [App.tsx](./src/App.tsx)
- Check build and deployment logs

### Facebook Rejects URLs
- Ensure HTTPS is enabled (required by Facebook)
- Check that pages load without JavaScript errors
- Verify pages are not behind authentication
- Ensure content meets Facebook's policy requirements

### Need to Update Content
1. Edit the respective page file:
   - [src/pages/TermsOfService.tsx](./src/pages/TermsOfService.tsx)
   - [src/pages/DataDeletion.tsx](./src/pages/DataDeletion.tsx)
   - [src/pages/PrivacyPolicy.tsx](./src/pages/PrivacyPolicy.tsx)
2. Deploy changes to production
3. No need to update Facebook app settings (URLs remain the same)

---

## Related Documentation

- [INSTAGRAM_TOKEN_MAINTENANCE.md](./INSTAGRAM_TOKEN_MAINTENANCE.md) - Token refresh guide
- [INSTAGRAM_TOKEN_GUIDE.md](./INSTAGRAM_TOKEN_GUIDE.md) - Initial setup guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment instructions

---

**Last Updated:** April 15, 2026
