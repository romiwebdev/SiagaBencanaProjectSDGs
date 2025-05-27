import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key')
}

// Fungsi untuk membuat client biasa
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client yang sudah dibuat untuk penggunaan umum (bisa dipakai juga)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin, hanya di server-side
export const supabaseAdmin =
  typeof window === 'undefined' && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null
