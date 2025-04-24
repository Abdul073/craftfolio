import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in your .env.local file
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);