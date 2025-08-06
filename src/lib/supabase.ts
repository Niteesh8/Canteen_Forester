import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here' ||
    !supabaseUrl.startsWith('https://')) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at?: string;
}

export interface MenuUpdate {
  id: number;
  admin_id: string;
  admin_name: string;
  item_id: number;
  item_name: string;
  action: 'added' | 'removed';
  created_at: string;
}