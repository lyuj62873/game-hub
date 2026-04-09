'use client'

import { createClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/nextjs'
import { useMemo } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Returns a Supabase client authenticated with the current Clerk session JWT.
 * Use this hook in Client Components to query the favorites table with RLS.
 *
 * @example
 * const supabase = useSupabaseClient()
 * const { data } = await supabase.from('favorites').select('*')
 */
export function useSupabaseClient() {
  const { session } = useSession()

  return useMemo(
    () =>
      createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          fetch: async (url, options = {}) => {
            const token = await session?.getToken({ template: 'supabase' })
            const headers = new Headers(options.headers)
            if (token) {
              headers.set('Authorization', `Bearer ${token}`)
            }
            return fetch(url, { ...options, headers })
          },
        },
      }),
    [session]
  )
}
