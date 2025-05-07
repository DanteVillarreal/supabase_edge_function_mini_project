import { supabase, generateTestUserId, edgeFunctionUrl } from './setup'

describe('log-action function', () => {
  const testEndpoint = 'log-action'

  it('should successfully log an action', async () => {
    try {
    const testUserId = generateTestUserId()
    const payload = {
      userId: testUserId,
      actionType: 'test-action',
      details: { test: true },
    }

    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: payload
    })

    console.log('Response:', { data, error })
    expect(error).toBeNull()
    expect(data.success).toBe(true)

    // Verify the action was logged in the database
    const { data: actions } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', testUserId)
      .eq('action_type', 'test-action')
      .single()

    expect(actions).toBeTruthy()
    expect(actions.details).toEqual({ test: true })
    } catch (error) {
      console.error('Test failed with error:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw error
    }
  })

  it('should reject request without required fields', async () => {
    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: {}
    })

    console.log('Response:', { data, error })
    expect(error).toBeTruthy()
  })
})
