import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/env";

const PROTECTED_ROUTES = ["/profile", "/library"];
const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Middleware session updater and route guard.
 * Refreshes auth tokens, synchronizes cookies, and validates access to protected routes.
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If Supabase is unconfigured in local dev, allow navigation to all pages for preview
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as CookieOptions)
        );
      },
    },
  });

  // Verify authenticated user on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // Unauthenticated user trying to access protected route -> redirect to login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated user trying to access login/signup -> redirect to home
  if (user && isAuthRoute) {
    const redirectUrl = new URL("/home", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
