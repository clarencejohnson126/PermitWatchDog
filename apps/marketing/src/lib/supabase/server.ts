// Supabase client for SERVER components (RSC, Route Handlers, Server Actions).
// Uses the cookie-based session managed by middleware.ts.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — ignore. middleware.ts will refresh.
          }
        },
      },
    },
  );
}

/** Returns the authenticated user's email, or null. Server-only. */
export async function getCurrentUserEmail(): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return data.user.email.toLowerCase();
}
