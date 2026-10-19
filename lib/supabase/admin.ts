import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client for administrative operations.
 * If SUPABASE_SERVICE_ROLE_KEY is set in .env.local, it uses the service_role secret
 * which automatically bypasses Row Level Security (RLS) entirely.
 * Otherwise, it falls back to the public anon key.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-geotrips.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  return createClient<any>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
