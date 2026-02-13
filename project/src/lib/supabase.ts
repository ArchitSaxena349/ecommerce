import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use real client only if explicitly configured and credentials are valid.
const envUseMock = import.meta.env.VITE_USE_MOCK === 'true';
const isBrokenConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('tlmwhzxaoflkczolztrg');

const useMock = envUseMock || isBrokenConfig;
type SupabaseClientLike = ReturnType<typeof createClient> | typeof mockSupabase;

export const supabase: SupabaseClientLike =
  !useMock && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockSupabase;

if (useMock) {
  console.warn('Using mock data layer.');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data layer.');
}
