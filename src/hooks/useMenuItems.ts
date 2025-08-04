import { useState, useEffect } from 'react';
import { supabase, MenuItem } from '../lib/supabase';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMenuItems();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('menu_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchMenuItems();
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      
      setMenuItems(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const updateItemAvailability = async (itemId: number, isAvailable: boolean, adminName: string) => {
    try {
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', itemId);

      if (updateError) throw updateError;

      // Log the update
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase
            .from('menu_updates')
            .insert({
              admin_id: userData.user.id,
              admin_name: adminName,
              item_id: itemId,
              item_name: item.name,
              action: isAvailable ? 'added' : 'removed'
            });
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Error updating item availability:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update item' 
      };
    }
  };

  return {
    menuItems,
    loading,
    error,
    lastUpdated,
    updateItemAvailability,
    refetch: fetchMenuItems
  };
};