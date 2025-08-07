import { useState, useEffect } from 'react';
import { supabase, Admin } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.log('Auth timeout - setting loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Session error:', error);
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error('Auth session error:', err);
      setError('Failed to initialize authentication');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchAdminProfile(session.user.id);
        } else {
          setAdmin(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    try {
      setError(null);
      console.log('Fetching admin profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      console.log('Admin profile query result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          // No admin profile found - this is expected for new signups
          console.log('No admin profile found for user:', userId);
          setError('No admin profile found. This might be a new account that needs approval.');
        } else {
          console.error('Error fetching admin profile:', error);
          setError(`Database error: ${error.message} (Code: ${error.code})`);
        }
        setAdmin(null);
      } else {
        console.log('Admin profile loaded successfully:', data);
        setAdmin(data);
        setError(null);
      }
      
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Login failed' 
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Starting signup process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      
      console.log('Auth signup successful:', data.user?.id);

      // Create admin profile
      if (data.user) {
        console.log('Creating admin profile for user:', data.user.id);
        
        const { error: profileError } = await supabase
          .from('admins')
          .insert({
            id: data.user.id,
            email,
            name,
            role: 'admin'
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          throw profileError;
        }
        
        console.log('Admin profile created successfully');
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Signup error:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Registration failed' 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Logout failed' 
      };
    }
  };

  return {
    user,
    admin,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user && !!admin
  };
};