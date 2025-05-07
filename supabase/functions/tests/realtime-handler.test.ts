import { supabase, generateTestUserId } from './setup'

describe('realtime-handler function', () => {
  const testEndpoint = 'realtime-handler'

  it('should handle INSERT event', async () => {
    const testPayload = {
      type: 'INSERT',
      table: 'button_clicks',
      record: {
        id: 1,
        user_id: generateTestUserId(),
        button_id: 'test-button',
        clicked_at: new Date().toISOString()
      },
      schema: 'public',
      old_record: null
    }

    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: testPayload
    })

    console.log('Response:', { data, error })
    expect(error).toBeNull()
    expect(data.success).toBe(true)
  })

  it('should reject invalid event type', async () => {
    const testPayload = {
      type: 'INVALID_TYPE',
      table: 'button_clicks',
      record: {},
      schema: 'public',
      old_record: null
    }

    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: testPayload
    })

    console.log('Response:', { data, error })
    expect(error).toBeTruthy()
  })
})
