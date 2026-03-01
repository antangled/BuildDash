import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (anon key — respects RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-only admin client (service role — bypasses RLS)
// Only use in API routes / server components, never expose to browser
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient<Database>(supabaseUrl, serviceKey);
}
