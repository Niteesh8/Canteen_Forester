import { useState, useEffect } from 'react';
import { supabase, MenuUpdate } from '../lib/supabase';

export const useRecentUpdates = (limit: number = 10) => {
  const [updates, setUpdates] = useState<MenuUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentUpdates();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel('menu_updates_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'menu_updates'
        },
        (payload) => {
          console.log('New update received:', payload);
          fetchRecentUpdates();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [limit]);

  const fetchRecentUpdates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching recent updates:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    updates,
    loading,
    refetch: fetchRecentUpdates
  };
};