// Script to create a Supabase storage bucket
import { createClient } from '@supabase/supabase-js';

// Use the values directly
const supabaseUrl = 'https://xtvtdardouudvqnmjdix.supabase.com';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dnRkYXJkb3V1ZHZxbm1qZGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDU1OTEsImV4cCI6MjA2MTA4MTU5MX0.l1mKEp8DVD3Bq5X54Z3nIS';
const bucketName = 'ambaturich-struk-storage';

async function createBucket() {
  try {
    console.log(`Connecting to Supabase: ${supabaseUrl}`);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create the bucket
    console.log(`Creating bucket: ${bucketName}`);

    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });

    if (error) {
      console.error('Error creating bucket:', error);

      // If bucket already exists, this is still okay
      if (
        error.message.includes('duplicate') ||
        error.message.includes('already exists')
      ) {
        console.log(`Bucket "${bucketName}" already exists, this is fine.`);
      }
    } else {
      console.log('Bucket created successfully:', data);
    }

    // List buckets to verify
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
    } else {
      console.log('Available buckets:', buckets.map((b) => b.name).join(', '));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createBucket();
