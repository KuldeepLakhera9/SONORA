import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Creates a privileged admin Supabase client using the Service Role Key.
 * 
 * CRITICAL SECURITY NOTICE:
 * - This client bypasses Row Level Security.
 * - MUST NEVER be exposed to the client bundle.
 * - Only use for trusted server-side tasks: moderation actions, rights verification status updates,
 *   admin audit logging, or secure background synchronization.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY CRITICAL: createAdminClient() cannot be instantiated in a browser environment."
    );
  }

  const { url, serviceRoleKey } = getSupabaseServerEnv();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
