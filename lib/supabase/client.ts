import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-ref')) {
    // Return dummy or null-safe client for mock/demo mode
    return createBrowserClient(
      'https://dummy-project.supabase.co',
      'dummy-anon-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
