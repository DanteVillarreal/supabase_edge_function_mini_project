// User as managed by Supabase Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Profile as stored in the profiles table
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  updated_at: string;
}

// Button click event as stored in button_clicks table
export interface ButtonClick {
  id: string;
  user_id: string;
  button_name: string;
  clicked_at: string;
  created_at: string;
} 