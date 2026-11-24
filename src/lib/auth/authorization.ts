import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types/database.types";
import { redirect } from "next/navigation";

/**
 * Retrieves the currently authenticated Supabase Auth user.
 * Validates session securely on the server via Supabase Auth API.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Enforces authenticated user access on Server Components or Route Handlers.
 * Redirects to /login if unauthenticated.
 */
export async function requireAuthenticatedUser(redirectTo?: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const destination = redirectTo
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(destination);
  }

  return user;
}

/**
 * Retrieves the application profile for the currently authenticated user.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}

/**
 * Enforces role authorization on Server Components.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<{
  user: User;
  profile: Profile;
}> {
  const user = await requireAuthenticatedUser();
  const profile = await getCurrentProfile();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/home");
  }

  return { user, profile };
}

/**
 * Checks if the current authenticated user has the 'admin' role.
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

/**
 * Checks if the current authenticated user has 'moderator' or 'admin' role.
 */
export async function isModerator(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "moderator" || profile?.role === "admin";
}

/**
 * Checks if the current authenticated user has 'artist', 'moderator', or 'admin' role.
 */
export async function isArtist(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return (
    profile?.role === "artist" ||
    profile?.role === "moderator" ||
    profile?.role === "admin"
  );
}
