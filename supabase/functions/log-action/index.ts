import { createClient } from '@supabase/supabase-js'
import { serve } from 'std/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "log-action" up and running!`)

interface ActionPayload {
  userId: string
  actionType: string
  details?: Record<string, any>
  timestamp?: string
}

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const { userId, actionType, details, timestamp = new Date().toISOString() }: ActionPayload = await req.json()

    // Validate required fields
    if (!userId || !actionType) {
      return new Response(
        JSON.stringify({ error: 'userId and actionType are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Insert action into button_clicks table
    const { data, error } = await supabaseClient
      .from('button_clicks')
      .insert([
        {
          user_id: userId,
          action_type: actionType,
          details,
          created_at: timestamp,
        },
      ])
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Action logged successfully', data }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
