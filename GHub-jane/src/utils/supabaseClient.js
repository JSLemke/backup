// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL und SUPABASE_ANON_KEY werden benötigt.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  schema: 'public',
  headers: {
    'x-api-key': process.env.SUPABASE_API_KEY || '',  // Beispiel für eine API-Schlüssel-Header
  },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
});

export default supabase;
