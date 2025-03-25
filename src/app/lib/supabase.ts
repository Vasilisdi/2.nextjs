import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
