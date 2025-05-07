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
      
      console.log('Test Payload:', JSON.stringify(payload, null, 2));
      
      const { data, error } = await supabase.functions.invoke(testEndpoint, {
        body: payload,
        headers: {
          Authorization: `Bearer ${supabaseKey}`
        }
      });
      
      console.log('Response:', JSON.stringify({ data, error }, null, 2));
      expect(error).toBeNull();
      expect(data.success).toBe(true);
      
      // Add a longer delay to allow for data propagation
      // console.log('Waiting for data to propagate...');
      // await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      
      // Attempting to read from the database with detailed logging
      console.log('Attempting to query the database for inserted actions...');
      console.log('Looking for user_id:', testUserId);
      
      // Check if supabaseAdmin is available for verification
      if (!supabaseAdmin) {
        console.error('No supabaseAdmin client available for verification - falling back to regular client');
        
        // Use regular client as fallback
        const { data: actions, error: selectError } = await supabase
          .from('user_actions')
          .select('*')
          .eq('user_id', testUserId);
          
        // Process results
        console.log('Database query completed (using regular client)');
        console.log('Query error:', selectError ? JSON.stringify(selectError, null, 2) : 'null');
        console.log('Number of actions found:', actions ? actions.length : 0);
        
        if (actions && actions.length > 0) {
          console.log('First action found:', JSON.stringify(actions[0], null, 2));
        } else {
          console.log('No actions found for user:', testUserId);
          
          // Additional debugging: try querying ALL actions
          console.log('Trying a broader query to see any actions in the table...');
          const { data: allActions } = await supabase
            .from('user_actions')
            .select('*')
            .limit(5);
          
          console.log('Total actions in table:', allActions ? allActions.length : 0);
          if (allActions && allActions.length > 0) {
            console.log('Some recent actions:', JSON.stringify(allActions, null, 2));
          }
        }
        
        // Now perform the assertions
        expect(selectError).toBeNull();
        expect(actions).not.toBeNull();
        expect(Array.isArray(actions)).toBe(true);
        
        if (actions && actions.length > 0) {
          console.log('Verification successful: Found actions for test user');
          expect(actions[0].details).toEqual({ test: true });
        } else {
          // Use expect to fail the test with a message
          expect('No matching actions found in database with regular client').toBe(false);
        }
      } else {
        // Use admin client to bypass RLS
        const { data: actions, error: selectError } = await supabaseAdmin
          .from('user_actions')
          .select('*')
          .eq('user_id', testUserId);
          
        console.log('Database query completed (using admin client)');
        console.log('Query error:', selectError ? JSON.stringify(selectError, null, 2) : 'null');
        console.log('Number of actions found:', actions ? actions.length : 0);
        
        if (actions && actions.length > 0) {
          console.log('First action found:', JSON.stringify(actions[0], null, 2));
        } else {
          console.log('No actions found for user:', testUserId);
          
          // Additional debugging: try querying ALL actions
          console.log('Trying a broader query to see any actions in the table...');
          const { data: allActions } = await supabaseAdmin
            .from('user_actions')
            .select('*')
            .limit(5);
          
          console.log('Total actions in table:', allActions ? allActions.length : 0);
          if (allActions && allActions.length > 0) {
            console.log('Some recent actions:', JSON.stringify(allActions, null, 2));
          }
        }
        
        // Now perform the assertions
        expect(selectError).toBeNull();
        expect(actions).not.toBeNull();
        expect(Array.isArray(actions)).toBe(true);
        expect(actions?.length).toBeGreaterThan(0); // Check that we have at least one row
        
        // Verify action details if found
        if (actions && actions.length > 0) {
          console.log('Verification successful: Found actions for test user');
          expect(actions[0].details).toEqual({ test: true });
        } else {
          // Use expect to fail the test with a message
          expect('No matching actions found in database with admin client').toBe(false);
        }
      }
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
    
    console.log('Response for empty request:', JSON.stringify({ data, error }, null, 2));
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