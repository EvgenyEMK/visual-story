---
description: "Security baseline: secrets management, input validation, auth, RLS, API protection"
alwaysApply: true
---

# Security Guidelines

## Secrets Management

- **Never hardcode secrets** (API keys, passwords, tokens, connection strings) in source code.
- All secrets go in environment variables. Reference `.env.example` for the required variables.
- Verify required secrets are present at app startup — fail fast with a clear error.
- If a secret may have been exposed (committed, logged, shared), rotate it immediately.
- `.env`, `.env.local`, and any file matching `.env.*` are in `.gitignore` and must never be committed.

## Input Validation

- Validate **all** user input at API route boundaries using Zod schemas.
- Validate URL parameters, query strings, request bodies, and file uploads.
- Fail fast with a 400 response and a clear (but non-leaking) error message.
- Never trust data from external sources: user input, API responses, webhook payloads, file content.

## Authentication & Authorisation

- Every protected API route must verify the user session via `supabase.auth.getUser()`.
- Return 401 for unauthenticated requests, 403 for insufficient permissions.
- Stripe webhooks must verify the signature via `stripe.webhooks.constructEvent()`.
- Never expose user IDs, internal error details, or stack traces in API responses.

## Data Access Control

- **Supabase RLS** enforces tenant isolation at the database level — every table with user data must have RLS policies.
- Application code must also filter by user/tenant ID as defence in depth.
- The admin Supabase client (bypasses RLS) is restricted to webhooks, migrations, and admin scripts.
- Never use the admin client in user-facing code paths.

## API Protection

- Rate limit mutation endpoints (POST, PUT, DELETE) and expensive operations (AI, TTS, export).
- CSRF protection is handled by Next.js cookie-based auth + SameSite cookies.
- Set security headers in `next.config.ts`: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options.
- Disable development/debug endpoints in production (check `NODE_ENV`).

## Media & Storage

- Use signed URLs with expiration for Cloudflare R2 object access.
- Validate file types and sizes before upload.
- Never serve user-uploaded content from the same origin as the app without sanitisation.

## Security Checklist (Before Every Commit)

- [ ] No hardcoded secrets in source code
- [ ] All user input validated at API boundaries
- [ ] Auth check present on protected routes
- [ ] Error messages don't leak internal details
- [ ] No `console.log` of sensitive data (tokens, passwords, PII)
- [ ] New database tables have RLS policies
