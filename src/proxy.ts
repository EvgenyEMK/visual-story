import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/lib/i18n-routing';
import { updateSession } from '@/lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Bypass all middleware work for the OAuth callback to avoid altering URL/query
  const pathnameEarly = request.nextUrl.pathname;
  if (/^\/auth\/callback$/.test(pathnameEarly)) {
    return NextResponse.next({ request });
  }

  // Bypass middleware for sitemap.xml and robots.txt to ensure they're accessible to crawlers
  if (/^\/(sitemap\.xml|robots\.txt)$/.test(pathnameEarly)) {
    return NextResponse.next({ request });
  }

  // First, update Supabase session (sets/refreshes auth cookies, may redirect)
  const spUpdateSessionResponse = await updateSession(request);

  // If updateSession decided to redirect, return that immediately
  const location = spUpdateSessionResponse.headers.get('location');
  if (location) {
    return spUpdateSessionResponse;
  }

  // Avoid any rewrites/redirects on the non-localized auth callback route
  const pathname = request.nextUrl.pathname;
  const isAuthCallback = /^\/auth\/callback$/.test(pathname);
  if (isAuthCallback) {
    return spUpdateSessionResponse;
  }

  // Then, apply i18n routing and merge cookies from Supabase response
  const i18nResponse = await handleI18nRouting(request);
  spUpdateSessionResponse.cookies.getAll().forEach(({ name, value }) => {
    i18nResponse.cookies.set(name, value);
  });
  return i18nResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
