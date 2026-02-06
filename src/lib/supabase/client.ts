import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { mockClient } from '@/lib/mockStore'

let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Returns either a real Supabase client or a mock client for local testing
export function createClient(): ReturnType<typeof mockClient.from> extends infer T
  ? { from: (table: string) => T }
  : never {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use mock client for local development without Supabase
  if (!url || !key) {
    return mockClient as any
  }

  if (!client) {
    client = createBrowserClient(url, key)
  }

  return client as any
}
