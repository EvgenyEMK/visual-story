import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

// TODO: add more protected prefixes as needed
const protectedPrefixes = ["/dashboard", "/projects"];

// checks if the user is authenticated.
// If not and the path is protected, redirects to the login page
// (with redirect back to the protected path after login).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  // note: supabase.auth.getUser() always gets data from DB - slower. getClaims() gets data from JWT.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const withoutLocale = segments.length > 0 && segments[0].length <= 5
    ? "/" + segments.slice(1).join("/")
    : pathname;
  const isAuthOrLogin =
    withoutLocale.startsWith("/auth") || withoutLocale.startsWith("/login");

  // Only gate specific paths
  const isProtected = protectedPrefixes.some((p) => withoutLocale.startsWith(p));

  if (isProtected && !user && !isAuthOrLogin) {
    // no user, redirect to the localized login page with original path as query param
    const url = request.nextUrl.clone();
    url.pathname = segments.length > 0 && segments[0].length <= 5
      ? `/${segments[0]}/auth/login`
      : "/auth/login";
    // Preserve the original full pathname (including locale) as 'next' parameter
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}
