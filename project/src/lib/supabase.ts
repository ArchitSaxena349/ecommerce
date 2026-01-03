import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use real client only if explicitly configured AND not the broken default
// Logic: Use mock if explicitly requested OR if credentials are bad
const envUseMock = import.meta.env.VITE_USE_MOCK === 'true';
const isBrokenConfig = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('tlmwhzxaoflkczolztrg');

const useMock = envUseMock || isBrokenConfig;

export const supabase = (!useMock && supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (mockSupabase as any);

if (useMock) {
  console.warn('⚠️ using MOCK DATA LAYER (Forced).');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using Mock Data Layer.');
}