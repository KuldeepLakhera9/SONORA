/**
 * SONORA Environment Variable Validation & Configuration
 * 
 * Centralizes environment access and validates required keys while ensuring
 * the Next.js build and Phase 1 frontend can run safely when Supabase credentials
 * are not yet configured in local development.
 */

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

export interface SupabaseServerEnv extends SupabasePublicEnv {
  serviceRoleKey: string;
}

/**
 * Checks whether client-side Supabase environment variables are configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && !url.includes("example") && !anonKey.includes("example"));
}

/**
 * Validates and returns the public Supabase configuration.
 * Safe for both client and server contexts.
 */
export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined."
      );
    }
    // Return placeholder during local dev without crashing static build
    return {
      url: url || "http://127.0.0.1:54321",
      anonKey: anonKey || "placeholder-anon-key",
    };
  }

  return { url, anonKey };
}

/**
 * Validates and returns the privileged server-side Supabase configuration.
 * MUST ONLY be called in server environments.
 */
export function getSupabaseServerEnv(): SupabaseServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: getSupabaseServerEnv() must never be invoked in client-side code."
    );
  }

  const { url, anonKey } = getSupabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing required SUPABASE_SERVICE_ROLE_KEY for server operations."
      );
    }
    return {
      url,
      anonKey,
      serviceRoleKey: "placeholder-service-role-key",
    };
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
  };
}
