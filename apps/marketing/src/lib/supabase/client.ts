// Supabase client for CLIENT components ('use client').
// Same session cookies as the server client — they meet at middleware.ts.

'use client';

import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
