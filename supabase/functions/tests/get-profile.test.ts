import { supabase, generateTestUserId, edgeFunctionUrl } from './setup'

describe('get-profile function', () => {
  const testEndpoint = 'get-profile'

  it('should successfully get a user profile', async () => {
    // First create a test profile
    const testUserId = generateTestUserId()
    const testProfile = {
      id: testUserId,
      username: 'test-user',
      email: 'test@example.com'
    }

    await supabase.from('profiles').insert([testProfile])

    // Test the get-profile endpoint
    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: { userId: testUserId }
    })

    console.log('Response:', { data, error })
    expect(error).toBeNull()
    expect(data.profile).toBeTruthy()
    expect(data.profile.username).toBe('test-user')

    // Clean up
    await supabase.from('profiles').delete().eq('id', testUserId)
  })

  it('should return 400 when userId is missing', async () => {
    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: {}
    })

    console.log('Response:', { data, error })
    expect(error).toBeTruthy()
  })
})
