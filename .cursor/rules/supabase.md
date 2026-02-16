---
description: "Supabase patterns: client separation, RLS multi-tenancy, auth helpers, data access"
globs: ["**/lib/supabase/**", "**/lib/db/**"]
alwaysApply: false
---

# Supabase Patterns

## Client Types

Three Supabase client variants exist in `lib/supabase/`. Use the correct one for the context:

| Client | File | Use When |
|--------|------|----------|
| **Server client** | `server.ts` | Server Components, Route Handlers, Server Actions |
| **Browser client** | `client.ts` | Client Components (`'use client'`) |
| **Admin client** | `admin.ts` | Bypasses RLS — webhooks, migrations, admin tasks only |

```typescript
// Server Component or API Route
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();

// Client Component
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

**Never use the admin client** for user-facing operations. It bypasses Row-Level Security.

## Authentication

Auth is handled by Supabase Auth with `@supabase/ssr` for cookie-based sessions:

```typescript
// Get the authenticated user
const { data: { user }, error } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

- Auth middleware in `lib/supabase/middleware.ts` refreshes sessions on every request.
- Google OAuth + email/password supported.
- Always check `user` before data operations — never assume auth state.

## Multi-Tenant Data Access

Every data query must be tenant-scoped:

- **RLS policies** at the database level enforce that users can only access their own tenant's data.
- **Application code** should also filter by tenant/user ID as defence in depth.
- Never construct queries that could return cross-tenant data.

```typescript
// CORRECT — scoped to authenticated user's data
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', user.id)
  .order('updated_at', { ascending: false });
```

## Query Patterns

- Always use `.select()` to specify columns — avoid `select('*')` in production for performance.
- Use `.single()` when expecting exactly one row (throws if 0 or 2+ rows).
- Handle errors from every Supabase call — check both `error` and `data`:

```typescript
const { data, error } = await supabase.from('projects').select('id, name');
if (error) {
  throw new Error(`Failed to fetch projects: ${error.message}`);
}
```

- Use `.eq()`, `.in()`, `.gte()` etc. for filtering — never concatenate user input into queries.

## Database Schema

Key tables: `users`, `projects`, `slides` (with `items` JSONB column for SlideItem tree), `voice_configs`, `exports`, `subscriptions`.

See `docs/technical-architecture/overview.md` section 4 for the full ERD.

## Migrations

Database migrations will be managed via Supabase CLI (`supabase/migrations/`). When creating schema changes:
1. Write the migration SQL file.
2. Test locally with `supabase db reset`.
3. Always include RLS policies for new tables.
4. Add corresponding TypeScript types in `types/`.
