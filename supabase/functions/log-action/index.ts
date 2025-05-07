
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

console.log(`Function "log-action" up and running!`);

serve(async (req: Request) => {
  // Add debug logging for environment variables
  console.log('SUPABASE_URL available:', !!Deno.env.get('SUPABASE_URL'));
  console.log('SUPABASE_ANON_KEY available:', !!Deno.env.get('SUPABASE_ANON_KEY'));
  console.log('SUPABASE_SERVICE_ROLE_KEY available:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders
      }
    });
  }
  
  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'No authorization header'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Enhanced client creation with error handling
    let supabaseClient;
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      // Try to use service role key first, fall back to anon key
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
      
      console.log('Using URL (first few chars):', supabaseUrl.substring(0, 10) + '...');
      console.log('Using service role key:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
      
      // Create client with service role key but WITHOUT auth header
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client created successfully');
    } catch (clientError: unknown) {
      const errorMessage = clientError instanceof Error ? clientError.message : String(clientError);
      console.error('Failed to create Supabase client:', errorMessage);
      return new Response(JSON.stringify({
        error: 'Failed to create Supabase client: ' + errorMessage
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Parse request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { userId, actionType, details, timestamp = new Date().toISOString() } = body;
    
    // Validate required fields
    if (!userId || !actionType) {
      return new Response(JSON.stringify({
        error: 'userId and actionType are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Insert action into user_actions table with detailed error handling
    console.log('Attempting database insert with:', {
      userId,
      actionType,
      details,
      timestamp
    });
    
    let data, error;
    try {
      console.log('Starting database operation');
      const result = await supabaseClient
        .from('user_actions')
        .insert([
          {
            user_id: userId,
            action_type: actionType,
            details,
            created_at: timestamp
          }
        ])
        .select();
      
      data = result.data;
      error = result.error;
      console.log('Database operation completed');
      
      if (error) {
        console.error('Database error details:', JSON.stringify(error));
        throw error;
      }
      
      console.log('Successfully inserted data:', data);
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      console.error('Database exception:', errorMessage);
      console.error('Full error:', JSON.stringify(dbError));
      return new Response(JSON.stringify({
        error: 'Database operation failed: ' + errorMessage,
        details: JSON.stringify(dbError)
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Unhandled error:', errorMessage);
    console.error('Full error details:', JSON.stringify(error));
    return new Response(JSON.stringify({
      error: errorMessage,
      details: JSON.stringify(error)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});