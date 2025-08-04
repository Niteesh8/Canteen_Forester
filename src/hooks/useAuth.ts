import { useState, useEffect } from 'react';
import { supabase, Admin } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminProfile(session.user.id);
      } else {
        setLoading(false);
      }
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

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching admin profile:', error);
      }
      
      setAdmin(data || null);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      // Create admin profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('admins')
          .insert({
            id: data.user.id,
            email,
            name,
            role: 'admin'
          });

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (err) {
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
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user && !!admin
  };
};