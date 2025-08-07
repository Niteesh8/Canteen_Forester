import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Homepage from './components/Homepage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './hooks/useAuth';
import { useMenuItems } from './hooks/useMenuItems';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'admin'>('home');
  const { user, admin, loading: authLoading, error: authError, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const { menuItems, loading: menuLoading, error: menuError, lastUpdated, updateItemAvailability } = useMenuItems();

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
                               import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_url_here';

  const handleLogin = (success: boolean) => {
    if (success) {
      // Wait a moment for the auth state to update
      setTimeout(() => {
        if (isAuthenticated) {
          setCurrentView('admin');
        } else {
          console.log('Authentication not complete, staying on login');
        }
      }, 1000);
    }
  };

  const handleLogout = () => {
    signOut();
    setCurrentView('home');
  };

  const handleUpdateItem = async (itemId: number, isAvailable: boolean) => {
    if (!admin) return { success: false, error: 'Not authenticated' };
    return await updateItemAvailability(itemId, isAvailable, admin.name);
  };

  // Show loading screen while checking authentication
  if (authLoading || menuLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Loading Forester Canteen...</p>
          <p className="text-green-600 text-sm mt-2">This should only take a few seconds</p>
        </div>
      </div>
    );
  }

  // Show auth error if there's one
  if (authError && !isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  // Show Supabase connection required message
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-orange-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Database Connection Required</h2>
          <p className="text-gray-600 mb-6">
            To use the dynamic features of Forester Canteen, please click the "Connect to Supabase" button 
            in the top right corner to set up your database.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Features you'll get:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Real-time menu updates</li>
              <li>• Multiple admin accounts</li>
              <li>• Activity tracking</li>
              <li>• Instant synchronization</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show error if menu items failed to load
  if (menuError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{menuError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <AdminLogin 
        onLogin={handleLogin} 
        onBack={() => setCurrentView('home')}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    );
  }

  if (currentView === 'admin' && isAuthenticated) {
    return (
      <AdminPanel
        menuItems={menuItems}
        admin={admin!}
        onUpdateItem={handleUpdateItem}
        onLogout={handleLogout}
        isConnected={true}
      />
    );
  }

  return (
    <Homepage
      menuItems={menuItems}
      lastUpdated={lastUpdated}
      onAdminLogin={() => setCurrentView('login')}
      isConnected={true}
    />
  );
}

export default App;