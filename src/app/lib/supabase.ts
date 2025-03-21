import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase URL
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY! // Service role key
);