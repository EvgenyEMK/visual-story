import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using service role key
 * Only use this for server-side admin operations
 * NEVER expose the service role key to the client
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.DB_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing DB_SUPABASE_SERVICE_ROLE_KEY. Required for admin operations."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
