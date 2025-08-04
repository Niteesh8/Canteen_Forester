import React, { useState, useEffect } from 'react';
import { User, Clock, Phone, Mail, MapPin } from 'lucide-react';
import Homepage from './components/Homepage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  image: string;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  // Breakfast
  { id: 1, name: 'Idli Sambhar', category: 'Breakfast', image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 2, name: 'Dosa', category: 'Breakfast', image: 'https://images.pexels.com/photos/5560756/pexels-photo-5560756.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 3, name: 'Upma', category: 'Breakfast', image: 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 4, name: 'Poha', category: 'Breakfast', image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  
  // Main Course
  { id: 5, name: 'Chicken Biryani', category: 'Main Course', image: 'https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 6, name: 'Veg Thali', category: 'Main Course', image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 7, name: 'Dal Rice', category: 'Main Course', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 8, name: 'Rajma Chawal', category: 'Main Course', image: 'https://images.pexels.com/photos/12737652/pexels-photo-12737652.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 9, name: 'Paneer Butter Masala', category: 'Main Course', image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  
  // Snacks
  { id: 10, name: 'Samosa', category: 'Snacks', image: 'https://images.pexels.com/photos/14477876/pexels-photo-14477876.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 11, name: 'Vadapav', category: 'Snacks', image: 'https://images.pexels.com/photos/8604067/pexels-photo-8604067.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 12, name: 'Pakora', category: 'Snacks', image: 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 13, name: 'Chaat', category: 'Snacks', image: 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  
  // Beverages
  { id: 14, name: 'Tea', category: 'Beverages', image: 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 15, name: 'Coffee', category: 'Beverages', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 16, name: 'Fresh Juice', category: 'Beverages', image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 17, name: 'Lassi', category: 'Beverages', image: 'https://images.pexels.com/photos/5946931/pexels-photo-5946931.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  
  // Desserts
  { id: 18, name: 'Gulab Jamun', category: 'Desserts', image: 'https://images.pexels.com/photos/6210958/pexels-photo-6210958.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 19, name: 'Kheer', category: 'Desserts', image: 'https://images.pexels.com/photos/6127344/pexels-photo-6127344.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { id: 20, name: 'Halwa', category: 'Desserts', image: 'https://images.pexels.com/photos/6127367/pexels-photo-6127367.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableItems, setAvailableItems] = useState<number[]>([1, 2, 5, 6, 10, 14, 15, 18]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Update timestamp when available items change
    setLastUpdated(new Date());
  }, [availableItems]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  const handleUpdateItems = (selectedItems: number[]) => {
    setAvailableItems(selectedItems);
  };

  if (currentView === 'login') {
    return <AdminLogin onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin' && isAuthenticated) {
    return (
      <AdminPanel
        allItems={ALL_MENU_ITEMS}
        availableItems={availableItems}
        onUpdateItems={handleUpdateItems}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Homepage
      allItems={ALL_MENU_ITEMS}
      availableItems={availableItems}
      lastUpdated={lastUpdated}
      onAdminLogin={() => setCurrentView('login')}
    />
  );
}

export default App;