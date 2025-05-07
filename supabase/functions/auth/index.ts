// Edge Function: Authentication Handler
// Handles user registration and login endpoints
// TODO: Implement registration and login logic

import { serve } from 'std/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "auth" up and running!`)

serve(async (req: Request) => {
  // Parse request URL and method
  const { pathname } = new URL(req.url);

  if (req.method === 'POST' && pathname.endsWith('/register')) {
    // TODO: Add user registration logic
    return new Response(JSON.stringify({ message: 'Register endpoint not implemented.' }), {
      status: 501,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST' && pathname.endsWith('/login')) {
    // TODO: Add user login logic
    return new Response(JSON.stringify({ message: 'Login endpoint not implemented.' }), {
      status: 501,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Default: Not found
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}); 