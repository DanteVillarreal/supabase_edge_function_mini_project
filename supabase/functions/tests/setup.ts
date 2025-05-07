import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' })

// Get environment variables (support both old and new names)
export const supabaseUrl = process.env.SUPABASE_URL ?? process.env.PROJECT_URL
export const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.ANON_KEY
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Edge function URL format
export const edgeFunctionUrl = supabaseUrl?.replace('.supabase.co', '.functions.supabase.co')
console.log('Edge function URL:', edgeFunctionUrl)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables. Need either:\n' +
    '- SUPABASE_URL and SUPABASE_ANON_KEY\n' +
    '- PROJECT_URL and ANON_KEY')
}

if (!supabaseServiceKey) {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.')
}

// Create regular client with anon key
export const supabase = createClient(supabaseUrl, supabaseKey)

// Create admin client with service role key
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Helper function to generate test user ID
export const generateTestUserId = () => `test-${Math.random().toString(36).substring(7)}`