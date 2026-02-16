# Feature: Authentication

## Module
User Management

## Overview
Authentication handles user sign-up, login, and session management. The system uses NextAuth.js (Auth.js) to provide secure OAuth and email-based authentication.

## User Stories

### US-AU-001: Sign Up with Email
**As a** new user  
**I want to** create an account with my email  
**So that** I can start using VisualStory

**Acceptance Criteria:**
- [ ] Email input with validation
- [ ] Password with strength requirements
- [ ] Email verification required
- [ ] Welcome email sent
- [ ] Automatic login after verification

### US-AU-002: Sign Up with Google
**As a** new user  
**I want to** sign up using my Google account  
**So that** I can get started quickly without creating a password

**Acceptance Criteria:**
- [ ] "Continue with Google" button
- [ ] OAuth consent flow
- [ ] Automatic account creation
- [ ] Profile picture imported

### US-AU-003: Log In
**As a** returning user  
**I want to** log into my account  
**So that** I can access my projects

**Acceptance Criteria:**
- [ ] Email + password login
- [ ] Google OAuth login
- [ ] "Remember me" option
- [ ] Redirect to dashboard after login

### US-AU-004: Reset Password
**As a** user who forgot my password  
**I want to** reset my password  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot password" link
- [ ] Email with reset link
- [ ] Link expires after 1 hour
- [ ] Password update confirmation

### US-AU-005: Log Out
**As a** logged-in user  
**I want to** log out  
**So that** I can secure my account

**Acceptance Criteria:**
- [ ] Logout button in header/menu
- [ ] Session destroyed
- [ ] Redirect to homepage
- [ ] Clear local data

## Technical Specifications

### NextAuth.js Configuration

> **Implementation**: See `src/lib/auth/index.ts` for the NextAuth configuration (Google + Credentials providers, PrismaAdapter, JWT callbacks) — placeholder file; user will copy their config

### Sign Up API

> **Implementation**: See `src/app/api/auth/signup/route.ts` for the sign-up handler (input validation, password hashing, user creation, verification email) — TODO

### Password Reset Flow

> **Implementation**: See `src/app/api/auth/` routes for forgot-password and reset-password handlers (token generation, expiration, email enumeration protection) — TODO

### Protected Routes Middleware

> **Implementation**: See `src/middleware.ts` for route protection logic (redirect unauthenticated users, redirect logged-in users from auth pages)

## UI Components

### Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    VisualStory Logo                         │
│                                                             │
│                    Welcome back                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🔵 Continue with Google                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│                    ────── or ──────                         │
│                                                             │
│  Email                                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ email@example.com                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Password                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ••••••••                                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ☐ Remember me              [Forgot password?]              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     Log In                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│              Don't have an account? [Sign up]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Implementation

> **Implementation**: See `src/components/auth/` for the LoginForm component (Google OAuth + credentials login, error handling, routing) — user will copy

## Database Schema

> **Implementation**: See `supabase/migrations/00001_initial_schema.sql` for User, Account, Session, VerificationToken, PasswordResetToken tables and Plan enum

## Security Considerations

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for session management
- CSRF protection via SameSite cookies
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Secure password reset flow

## Dependencies
- next-auth v5 (Auth.js)
- bcryptjs
- @auth/prisma-adapter
- Resend for email delivery

## Related Features
- [Projects Library](./projects-library.md)
- [Subscription Billing](./subscription-billing.md)
