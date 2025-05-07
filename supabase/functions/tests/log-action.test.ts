import { supabase, supabaseAdmin, edgeFunctionUrl, supabaseKey } from './setup';

describe('log-action function', () => {
  const testEndpoint = 'log-action';
  // Explicitly define the type for testUserId
  let testUserId: string | undefined;

  beforeAll(async () => {
    if (!supabaseAdmin) {
      console.error('No supabaseAdmin client available - missing service role key');
      expect(supabaseAdmin).toBeTruthy(); // Fail the test if no admin client
      return;
    }

    try {
      // Create a test user using admin client
      console.log('Creating test user...');
      const { data, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        email_confirm: true
      });
      
      if (userError) {
        console.error('Error creating test user:', userError);
        expect(userError).toBeNull(); // Fail the test with an error message
        return;
      }
      
      // Safely check data
      if (!data || !data.user) {
        console.error('User data is null or undefined');
        expect(data?.user).toBeTruthy(); // Fail the test with an error message
        return;
      }
      
      testUserId = data.user.id;
      console.log('Created test user with ID:', testUserId);
    } catch (error) {
      console.error('Unexpected error in beforeAll:', error);
      expect(error).toBeNull(); // Fail the test with an error message
    }
  });

  it('should successfully log an action', async () => {
    // Make sure testUserId exists
    expect(testUserId).toBeDefined();
    
    try {
      const payload = {
        userId: testUserId,
        actionType: 'test-action',
        details: { test: true },
      };
      
      console.log('Test Payload:', JSON.stringify(payload));
      
      const { data, error } = await supabase.functions.invoke(testEndpoint, {
        body: payload,
        headers: {
          Authorization: `Bearer ${supabaseKey}`
        }
      });
      
      console.log('Response:', { data, error });
      expect(error).toBeNull();
      expect(data.success).toBe(true);
      
      // Verify the action was logged in the database
      const { data: actions, error: selectError } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', testUserId)
        .eq('action_type', 'test-action')
        .single();
      
      console.log('Database query result:', { actions, selectError });
      
      expect(selectError).toBeNull();
      expect(actions).toBeTruthy();
      expect(actions.details).toEqual({ test: true });
    } catch (error) {
      console.error('Test failed with error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  });

  it('should reject request without required fields', async () => {
    const { data, error } = await supabase.functions.invoke(testEndpoint, {
      body: {},
      headers: {
        Authorization: `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Response:', { data, error });
    expect(error).toBeTruthy();
  });

  // Clean up the test user after all tests are done
  afterAll(async () => {
    if (testUserId && supabaseAdmin) {
      console.log('Cleaning up test user:', testUserId);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(testUserId);
      if (error) {
        console.error('Error deleting test user:', error);
      }
    }
  });
});