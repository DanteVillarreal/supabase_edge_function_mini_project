import { useState } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '../types';

interface UseAuth {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuth {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder implementations
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // TODO: Implement sign in logic
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // TODO: Implement sign up logic
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    // TODO: Implement sign out logic
    setLoading(false);
  };

  return { user, loading, error, signIn, signUp, signOut };
} 