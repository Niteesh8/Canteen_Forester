/*
  # Forester Canteen Database Schema

  1. New Tables
    - `menu_items`
      - `id` (integer, primary key)
      - `name` (text, menu item name)
      - `category` (text, food category)
      - `image` (text, image URL)
      - `is_available` (boolean, availability status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admins`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, admin email)
      - `name` (text, admin name)
      - `role` (text, admin role)
      - `is_active` (boolean, account status)
      - `created_at` (timestamp)
    
    - `menu_updates`
      - `id` (integer, primary key)
      - `admin_id` (uuid, references admins)
      - `admin_name` (text, admin name for quick access)
      - `item_id` (integer, references menu_items)
      - `item_name` (text, item name for quick access)
      - `action` (text, 'added' or 'removed')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for menu items
    - Admin-only write access for menu management

  3. Real-time
    - Enable real-time subscriptions for menu_items table
    - Enable real-time subscriptions for menu_updates table
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id integer PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  is_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create menu_updates table for activity tracking
CREATE TABLE IF NOT EXISTS menu_updates (
  id serial PRIMARY KEY,
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  admin_name text NOT NULL,
  item_id integer REFERENCES menu_items(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('added', 'removed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_updates ENABLE ROW LEVEL SECURITY;

-- Policies for menu_items (public read, admin write)
CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Policies for admins
CREATE POLICY "Admins can view all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update their own profile"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Policies for menu_updates
CREATE POLICY "Anyone can view menu updates"
  ON menu_updates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert menu updates"
  ON menu_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Insert initial menu items
INSERT INTO menu_items (id, name, category, image, is_available) VALUES
-- Breakfast
(1, 'Idli Sambhar', 'Breakfast', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(2, 'Dosa', 'Breakfast', 'https://images.pexels.com/photos/5560756/pexels-photo-5560756.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(3, 'Upma', 'Breakfast', 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(4, 'Poha', 'Breakfast', 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),

-- Main Course
(5, 'Chicken Biryani', 'Main Course', 'https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(6, 'Veg Thali', 'Main Course', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(7, 'Dal Rice', 'Main Course', 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(8, 'Rajma Chawal', 'Main Course', 'https://images.pexels.com/photos/12737652/pexels-photo-12737652.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(9, 'Paneer Butter Masala', 'Main Course', 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),

-- Snacks
(10, 'Samosa', 'Snacks', 'https://images.pexels.com/photos/14477876/pexels-photo-14477876.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(11, 'Vadapav', 'Snacks', 'https://images.pexels.com/photos/8604067/pexels-photo-8604067.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(12, 'Pakora', 'Snacks', 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(13, 'Chaat', 'Snacks', 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),

-- Beverages
(14, 'Tea', 'Beverages', 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(15, 'Coffee', 'Beverages', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(16, 'Fresh Juice', 'Beverages', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(17, 'Lassi', 'Beverages', 'https://images.pexels.com/photos/5946931/pexels-photo-5946931.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),

-- Desserts
(18, 'Gulab Jamun', 'Desserts', 'https://images.pexels.com/photos/6210958/pexels-photo-6210958.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', true),
(19, 'Kheer', 'Desserts', 'https://images.pexels.com/photos/6127344/pexels-photo-6127344.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false),
(20, 'Halwa', 'Desserts', 'https://images.pexels.com/photos/6127367/pexels-photo-6127367.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', false)

ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for menu_items
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_updates;