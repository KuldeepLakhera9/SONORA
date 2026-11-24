import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route Handler for Supabase Auth Callbacks:
 * - Email verification links
 * - Password recovery magic links
 * - OAuth redirect exchanges
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/home";

  // Sanitize next param to prevent open redirect vulnerabilities
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/home";

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
      }
    } catch {
      // Proceed to error fallback
    }
  }

  // Redirect to login with error query param if exchange fails
  return NextResponse.redirect(
    new URL(`/login?error=verification_failed`, requestUrl.origin)
  );
}
