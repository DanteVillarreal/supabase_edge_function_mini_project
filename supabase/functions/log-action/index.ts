import { createClient } from '@supabase/supabase-js'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "log-action" up and running!`)

interface ActionPayload {
  userId: string
  actionType: string
  details?: Record<string, any>
  timestamp?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders } })
  }

  try {
    // Create Supabase client
    // Get auth header
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header:', authHeader)
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )



    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const body = await req.json()
    console.log('Request body:', body)
    const { userId, actionType, details, timestamp = new Date().toISOString() }: ActionPayload = body

    // Validate required fields
    if (!userId || !actionType) {
      return new Response(
        JSON.stringify({ error: 'userId and actionType are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Insert action into user_actions table
    console.log('Inserting action:', { userId, actionType, details, timestamp });
    console.log('Attempting database insert with:', { userId, actionType, details, timestamp });
    const { data, error } = await supabaseClient
      .from('user_actions')
      .insert([
        {
          user_id: userId,
          action_type: actionType,
          details,
          created_at: timestamp,
        },
      ])
      .select();
    
    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('Successfully inserted data:', data);
    }
    

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
