// Refresh the Supabase auth session on every request and gate protected routes.
// Per Supabase SSR best practices — runs before the route handler/page.

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = ['/dashboard'];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            req.cookies.set(name, value);
          }
          response = NextResponse.next({ request: req });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANT — calling getUser() refreshes the session token cookie.
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on every page except static files / Next.js internals.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|videos/|images/|.*\\..*).*)'],
};
