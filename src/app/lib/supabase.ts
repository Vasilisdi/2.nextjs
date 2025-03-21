import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,  // Server-side environment variable
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server-side service role key
);
