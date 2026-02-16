---
description: "Next.js API route patterns: Route Handlers, validation, error responses, auth, rate limiting"
globs: ["**/app/api/**"]
alwaysApply: false
---

# API Route Patterns

## Route Handler Structure

Use Next.js App Router Route Handlers. Each route file exports named HTTP method functions.

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // ... business logic
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Input Validation

Validate all input at the route boundary using Zod schemas:

```typescript
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  intent: z.enum(['educational', 'promotional', 'storytelling']),
  script: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = CreateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  // ... use parsed.data (fully typed)
}
```

## Error Responses

Use a consistent error response format across all API routes:

```typescript
// Success
{ data: T }
{ data: T, meta: { total: number, page: number } }

// Error
{ error: string }
{ error: string, details: unknown }
```

Return appropriate HTTP status codes:
- `400` — invalid input / bad request
- `401` — not authenticated
- `403` — not authorised (authenticated but insufficient permissions)
- `404` — resource not found
- `409` — conflict (duplicate, stale data)
- `429` — rate limited
- `500` — internal server error (log details, never expose to client)

## Authentication

Every protected route must verify the user session via Supabase:

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... user is authenticated
}
```

## Rate Limiting

Apply rate limiting on mutation endpoints (POST, PUT, DELETE) and expensive operations (AI generation, TTS, export). Use Upstash Redis rate limiter or equivalent.

## Multi-Tenant Data Access

All data queries must be tenant-scoped. Never return data without filtering by the authenticated user's tenant. Supabase RLS policies enforce this at the database level, but application code should also filter explicitly as defence in depth.

## API Route Organisation

```
app/api/
├── projects/           # Project CRUD, generation, export
├── billing/            # Stripe checkout, portal
├── webhooks/stripe/    # Stripe webhook handler (signature verified)
├── ai/                 # AI endpoints (script feedback, generation)
├── exports/            # Export status polling
└── dev/                # Development/debugging (disabled in production)
```
