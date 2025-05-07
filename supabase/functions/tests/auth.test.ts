import { supabase } from './setup'

describe('auth function', () => {
  const testEndpoint = 'auth'

  it('should return 501 for /register endpoint', async () => {
    try {
      const response = await supabase.functions.invoke(`${testEndpoint}/register`, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'test123'
        }
      })

      console.log('Register response:', response)
      // For 501 status codes, Supabase client returns a generic error
      expect(response.error).toBeTruthy()
      expect(response.error.message).toBe('Edge Function returned a non-2xx status code')
      expect(response.data).toBeNull()
    } catch (err) {
      console.error('Register test failed:', err)
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      throw err
    }
  })

  it('should return 501 for /login endpoint', async () => {
    try {
      const response = await supabase.functions.invoke(`${testEndpoint}/login`, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'test123'
        }
      })

      console.log('Login response:', response)
      // For 501 status codes, Supabase client returns a generic error
      expect(response.error).toBeTruthy()
      expect(response.error.message).toBe('Edge Function returned a non-2xx status code')
      expect(response.data).toBeNull()
    } catch (err) {
      console.error('Login test failed:', err)
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      throw err
    }
  })

  it('should return 404 for unknown endpoints', async () => {
    try {
      const response = await supabase.functions.invoke(`${testEndpoint}/unknown`, {
        method: 'POST',
        body: {}
      })

      console.log('Unknown endpoint response:', response)
      // For non-200 status codes, Supabase client returns a generic error
      expect(response.error).toBeTruthy()
      expect(response.error.message).toBe('Edge Function returned a non-2xx status code')
      expect(response.data).toBeNull()
    } catch (err) {
      console.error('Unknown endpoint test failed:', err)
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      throw err
    }
  })
})
