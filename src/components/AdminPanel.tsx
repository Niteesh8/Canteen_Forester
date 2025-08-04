import React, { useState } from 'react';
import { LogOut, Save, RotateCcw, CheckCircle, Circle } from 'lucide-react';
import { MenuItem } from '../App';

interface AdminPanelProps {
  allItems: MenuItem[];
  availableItems: number[];
  onUpdateItems: (selectedItems: number[]) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  allItems,
  availableItems,
  onUpdateItems,
  onLogout
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>(availableItems);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const groupedItems = allItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const toggleItem = (itemId: number) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelection);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateItems(selectedItems);
    setHasChanges(false);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleReset = () => {
    setSelectedItems(availableItems);
    setHasChanges(false);
  };

  const selectAll = () => {
    setSelectedItems(allItems.map(item => item.id));
    setHasChanges(true);
  };

  const deselectAll = () => {
    setSelectedItems([]);
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-green-200 mt-1">Forester Canteen - Menu Management</p>
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
                Selected: {selectedItems.length} of {allItems.length} items
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
                  Changes saved successfully!
                </div>
              )}
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-semibold"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-700 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <span className="text-green-200 text-sm">
                    {items.filter(item => selectedItems.includes(item.id)).length} of {items.length} selected
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                        }`}
                      >
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {isSelected ? (
                              <CheckCircle className="text-green-600 bg-white rounded-full" size={24} />
                            ) : (
                              <Circle className="text-gray-400 bg-white rounded-full" size={24} />
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Available
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`p-4 text-center ${isSelected ? 'bg-green-100' : 'bg-gray-50'}`}>
                          <h4 className={`font-semibold ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                            {item.name}
                          </h4>
                          <p className={`text-sm mt-1 ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                            {isSelected ? 'Available' : 'Not Available'}
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
      </main>
    </div>
  );
};

export default AdminPanel;