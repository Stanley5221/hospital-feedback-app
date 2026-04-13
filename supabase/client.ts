import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a stub client during build, real client at runtime
let supabase: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  // Ignore errors during build
}

// Fallback stub for when not properly configured
if (!supabase) {
  supabase = {
    from: () => ({ insert: async () => ({ error: null }), select: async () => ({ data: [] }) }),
    storage: { from: () => ({ upload: async () => ({ data: null, error: null }) }) },
  };
}

export { supabase };
