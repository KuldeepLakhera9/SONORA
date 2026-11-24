import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or retrieves the singleton client-side Supabase client.
 * Uses public anon key with Row Level Security enforcement.
 */
export function createClient() {
  if (browserClient) return browserClient;

  const { url, anonKey } = getSupabasePublicEnv();

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}

export { isSupabaseConfigured };
