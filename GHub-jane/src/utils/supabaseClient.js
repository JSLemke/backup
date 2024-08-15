import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL und SUPABASE_ANON_KEY werden benötigt.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
