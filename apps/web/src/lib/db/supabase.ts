// Server-side Supabase admin client
// For browser client, use @/lib/supabase/client
// For SSR server client, use @/lib/supabase/server
// For middleware client, use @/lib/supabase/middleware

import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (service role — full access).
 * Use this in API routes, server actions, and background jobs.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.DB_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
