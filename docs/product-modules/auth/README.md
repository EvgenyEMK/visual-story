# Auth

> **Status:** `planned`
> **MVP:** Yes

## Overview

The auth module handles all user authentication flows — sign-up, login, password reset, and session management. The system uses Supabase Auth with email/password and Google OAuth as the primary methods. Each new sign-up auto-creates a personal tenant (workspace).

## Features

| Feature | File | Summary |
|---------|------|---------|
| Authentication | [authentication.md](./authentication.md) | Email + Google OAuth sign-up/login, password reset, email verification, session management |

## Planned User Flows

### Sign Up
1. User clicks "Try it free" → sign-up page
2. Chooses email/password or Google OAuth
3. Email verification sent (if email method)
4. Personal workspace auto-created
5. Redirect to onboarding or projects library

### Login
1. User navigates to login page
2. Enters credentials or clicks Google OAuth
3. Session created → redirect to projects library

### Password Reset
1. User clicks "Forgot password" on login page
2. Enters email → reset link sent
3. Clicks link → sets new password → redirect to login

## Future Features (Phase 2+)

- **SSO (SAML/OIDC)** — Enterprise single sign-on
- **Multi-factor authentication (MFA)** — TOTP or SMS-based 2FA
- **Social login expansion** — Microsoft, GitHub, Apple
- **Workspace invitations** — Accept invite → join team workspace

## Related Modules

- [user-profile/](../user-profile/) — Post-login dashboard and account management
