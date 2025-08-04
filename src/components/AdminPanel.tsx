import React, { useState } from 'react';
import { LogOut, Save, RotateCcw, CheckCircle, Circle, Users, Activity, Wifi } from 'lucide-react';
import { MenuItem, Admin } from '../lib/supabase';
import { useRecentUpdates } from '../hooks/useRecentUpdates';

interface AdminPanelProps {
  menuItems: MenuItem[];
  admin: Admin;
  onUpdateItem: (itemId: number, isAvailable: boolean) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  isConnected: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  menuItems,
  admin,
  onUpdateItem,
  onLogout,
  isConnected
}) => {
  const { updates, loading: updatesLoading } = useRecentUpdates(10);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const toggleItem = async (itemId: number, currentAvailability: boolean) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    setError(null);

    const result = await onUpdateItem(itemId, !currentAvailability);
    
    if (result.success) {
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    } else {
      setError(result.error || 'Failed to update item');
    }

    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const selectAll = () => {
    menuItems.forEach(item => {
      if (!item.is_available) {
        toggleItem(item.id, false);
      }
    });
  };

  const deselectAll = () => {
    menuItems.forEach(item => {
      if (item.is_available) {
        toggleItem(item.id, true);
      }
    });
  };

  const availableCount = menuItems.filter(item => item.is_available).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-green-200 mt-1">Welcome, {admin.name}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-green-200 text-sm">
                  <Wifi size={14} />
                  <span>{isConnected ? 'Connected' : 'Offline'}</span>
                </div>
                <div className="flex items-center gap-1 text-green-200 text-sm">
                  <Users size={14} />
                  <span className="capitalize">{admin.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Available: {availableCount} of {menuItems.length} items
              </span>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {showSaveMessage && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={16} />
                  Item updated successfully!
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-700 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <span className="text-green-200 text-sm">
                    {items.filter(item => item.is_available).length} of {items.length} available
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const isUpdating = updatingItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => !isUpdating && toggleItem(item.id, item.is_available)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          item.is_available
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {isUpdating ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white bg-gray-800 bg-opacity-50"></div>
                            ) : item.is_available ? (
                              <CheckCircle className="text-green-600 bg-white rounded-full" size={24} />
                            ) : (
                              <Circle className="text-gray-400 bg-white rounded-full" size={24} />
                            )}
                          </div>
                          {item.is_available && !isUpdating && (
                            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Available
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`p-4 text-center ${item.is_available ? 'bg-green-100' : 'bg-gray-50'}`}>
                          <h4 className={`font-semibold ${item.is_available ? 'text-green-800' : 'text-gray-800'}`}>
                            {item.name}
                          </h4>
                          <p className={`text-sm mt-1 ${item.is_available ? 'text-green-600' : 'text-gray-600'}`}>
                            {isUpdating ? 'Updating...' : (item.is_available ? 'Available' : 'Not Available')}
                          </p>
                        </div>
                      </div>
                    );  
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-700 text-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Activity size={20} />
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
            </div>
            <div className="p-6">
              {updatesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : updates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {update.item_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {update.action === 'added' ? 'Added to menu' : 'Removed from menu'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {update.admin_name}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(update.created_at).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;