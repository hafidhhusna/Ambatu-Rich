import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://xtvtdardouudvqnmjdix.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dnRkYXJkb3V1ZHZxbm1qZGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDU1OTEsImV4cCI6MjA2MTA4MTU5MX0.l1mKEp8DVD3Bq5X54Z3nISsikKngqv4vdiXAwbbJLpY';

// Constants
export const BUCKET_NAME = 'ambaturich-struk-storage';
export const FOLDER_PATH = 'public';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if storage is available
if (typeof window !== 'undefined') {
  if (supabase.storage) {
    console.log('Supabase storage is available');
  } else {
    console.error(
      'Supabase storage is NOT available - this will cause mock data to be used'
    );
  }
}
