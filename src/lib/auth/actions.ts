"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
} from "./validation";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

/**
 * Helper to obtain origin for email verification / recovery redirect callbacks.
 */
async function getAppOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

/**
 * Real-time username availability check (case-insensitive)
 */
export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean; message?: string }> {
  const clean = username.trim().toLowerCase();

  if (clean.length < 3) {
    return { available: false, message: "Username must be at least 3 characters" };
  }
  if (!/^[a-z0-9_-]+$/.test(clean)) {
    return {
      available: false,
      message: "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }
  if (["admin", "moderator", "sonora", "system", "root", "support"].includes(clean)) {
    return { available: false, message: "This username is reserved" };
  }

  if (!isSupabaseConfigured()) {
    // In local dev without live DB, allow all valid formatted usernames
    return { available: true };
  }

  try {
    const supabase = await createClient();
    const { data: existing, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", clean)
      .maybeSingle();

    if (error) {
      return { available: true };
    }

    return {
      available: !existing,
      message: existing ? "This username is already taken" : undefined,
    };
  } catch {
    return { available: true };
  }
}

/**
 * USER REGISTRATION SERVER ACTION
 */
export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: formData.get("acceptTerms") === "on" || formData.get("acceptTerms") === "true",
  };

  const validation = signupSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { displayName, username, email, password } = validation.data;

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable real registration.",
    };
  }

  const availability = await checkUsernameAvailability(username);
  if (!availability.available) {
    return {
      success: false,
      message: availability.message || "This username is already taken.",
      errors: { username: [availability.message || "Username taken"] },
    };
  }

  try {
    const supabase = await createClient();
    const origin = await getAppOrigin();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          display_name: displayName,
          username: username.toLowerCase(),
          role: "listener", // Guaranteed listener role
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
    }

    // Check if user already exists or needs email confirmation
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      return {
        success: false,
        message: "An account with this email address already exists. Please sign in instead.",
      };
    }

    return {
      success: true,
      message:
        "Your account has been created! Please check your email to verify your address before signing in.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
    return { success: false, message };
  }
}

/**
 * LOGIN SERVER ACTION
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid email or password format.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase credentials are not configured in .env.local. Please configure your Supabase URL and Anon Key.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Prevent user enumeration by providing safe, consistent error messages
      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          message: "Please verify your email address before signing in. Check your inbox for the confirmation link.",
        };
      }
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    const redirectTo = formData.get("redirectTo")?.toString();
    const safeRedirect = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/home";

    redirect(safeRedirect);
  } catch (err: unknown) {
    // Re-throw redirect if triggered by Next.js navigation
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Failed to sign in. Please try again.";
    return { success: false, message };
  }
}

/**
 * LOGOUT SERVER ACTION
 */
export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors
    }
  }
  redirect("/login");
}

/**
 * FORGOT PASSWORD SERVER ACTION
 */
export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
  };

  const validation = forgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email } = validation.data;

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase is not configured yet. Please check .env.local.",
    };
  }

  try {
    const supabase = await createClient();
    const origin = await getAppOrigin();

    // Sends recovery email with redirect to /reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      // For security, do not reveal if an email exists or not
      return {
        success: true,
        message: "If an account exists with that email, a recovery link has been sent.",
      };
    }

    return {
      success: true,
      message: "If an account exists with that email, a recovery link has been sent.",
    };
  } catch {
    return {
      success: true,
      message: "If an account exists with that email, a recovery link has been sent.",
    };
  }
}

/**
 * RESET PASSWORD SERVER ACTION
 */
export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = resetPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { password } = validation.data;

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase is not configured yet.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to update password. Your recovery link may have expired.",
      };
    }

    return {
      success: true,
      message: "Your password has been successfully updated. You can now sign in with your new credentials.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reset password.";
    return { success: false, message };
  }
}

/**
 * UPDATE PROFILE SERVER ACTION
 */
export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    bio: formData.get("bio") || "",
  };

  const validation = profileUpdateSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { displayName, username, bio } = validation.data;

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase is not configured yet.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, message: "You must be signed in to update your profile." };
    }

    // Check if new username is chosen and if it's taken by another user
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        message: "This username is already taken by another user.",
        errors: { username: ["Username already taken"] },
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return { success: false, message: error.message || "Failed to update profile." };
    }

    return { success: true, message: "Profile updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile.";
    return { success: false, message };
  }
}
