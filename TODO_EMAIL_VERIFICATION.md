# TODO: Email Verification Feature

## Current State
- Backend has `email_verified` field in User model (boolean, default: false)
- Google OAuth users automatically get `email_verified: true`
- Email/password signups get `email_verified: false`
- No email sending functionality implemented yet

## Required Implementation

### 1. Backend Requirements
- **Email Service Setup**
  - Choose provider: SendGrid, AWS SES, Mailgun, or Resend
  - Add API keys to Doppler
  - Install email library (e.g., `python-sendgrid` or `boto3`)

- **New Endpoints**
  ```
  POST /api/v1/auth/send-verification-email
  GET /api/v1/auth/verify-email?token=<token>
  POST /api/v1/auth/resend-verification-email
  ```

- **Verification Token System**
  - Generate secure tokens (JWT or random UUID)
  - Store tokens in database with expiration
  - Create verification email templates

### 2. Frontend Requirements
- **Dashboard Banner**
  - Show "Email not verified" warning banner
  - "Resend verification email" button
  - Success/error messages

- **Verification Page**
  - Route: `/verify-email?token=<token>`
  - Success/failure states
  - Redirect to dashboard after verification

- **Email Template**
  - Professional HTML email template
  - Verification link with token
  - Fallback plain text version

### 3. User Experience Flow
1. User signs up with email/password
2. Account created with `email_verified: false`
3. Verification email sent automatically
4. User clicks link in email
5. Token validated, account marked as verified
6. User redirected to dashboard with success message

### 4. Optional Enhancements
- Restrict certain features until email is verified
- Send welcome email after verification
- Rate limit verification email sends
- Email change verification

## Files to Modify

### Backend
- `app/services/email_service.py` (NEW)
- `app/api/auth.py` (add endpoints)
- `app/models/user.py` (add verification token field if needed)
- `app/templates/emails/verify_email.html` (NEW)
- `requirements.txt` (add email library)

### Frontend
- `src/components/auth/EmailVerificationBanner.tsx` (NEW)
- `src/pages/VerifyEmail.tsx` (NEW)
- `src/pages/Dashboard.tsx` (add banner)
- `src/lib/api-client.ts` (add endpoints)
- `src/App.tsx` (add verify-email route)

## Priority
**Low** - Email verification is nice-to-have but not critical for MVP.
Users can still use all features without email verification.

## References
- SendGrid: https://sendgrid.com/docs/api-reference/
- AWS SES: https://docs.aws.amazon.com/ses/
- Resend: https://resend.com/docs
