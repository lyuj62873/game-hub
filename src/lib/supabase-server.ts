import { createClient } from '@supabase/supabase-js'

/**
 * Anon Supabase client for Server Components reading public data.
 * No JWT — relies on RLS policies that allow public SELECT.
 */
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
