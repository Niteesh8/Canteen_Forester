import React from 'react';
import { User, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { MenuItem } from '../App';

interface HomepageProps {
  allItems: MenuItem[];
  availableItems: number[];
  lastUpdated: Date;
  onAdminLogin: () => void;
}

const Homepage: React.FC<HomepageProps> = ({
  allItems,
  availableItems,
  lastUpdated,
  onAdminLogin
}) => {
  const availableMenuItems = allItems.filter(item => availableItems.includes(item.id));
  
  const groupedItems = availableMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-wide">Forester Canteen</h1>
              <p className="text-green-200 mt-1 text-lg">Proprietor: Hari Maruthi</p>
            </div>
            <button
              onClick={onAdminLogin}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
            >
              <User size={20} />
              Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* Last Updated */}
      <div className="bg-green-700 text-white py-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock size={16} />
            <span>Last Updated: {formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-2">Today's Available Items</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded"></div>
        </div>

        {availableMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Available</h3>
              <p className="text-gray-500">Please check back later or contact us for more information.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-700 text-white px-6 py-3">
                  <h3 className="text-xl font-semibold">{category}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-orange-100">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 text-center">{item.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Contact Section */}
      <footer className="bg-green-800 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">Contact & Queries</h3>
            <div className="w-16 h-1 bg-green-400 mx-auto rounded mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Phone className="mx-auto text-green-300" size={24} />
              <h4 className="font-semibold text-lg">Phone</h4>
              <p className="text-green-200">+91 98765 43210</p>
              <p className="text-green-200">+91 87654 32109</p>
            </div>
            
            <div className="space-y-2">
              <Mail className="mx-auto text-green-300" size={24} />
              <h4 className="font-semibold text-lg">Email</h4>
              <p className="text-green-200">forester.canteen@email.com</p>
              <p className="text-green-200">hari.maruthi@email.com</p>
            </div>
            
            <div className="space-y-2">
              <MapPin className="mx-auto text-green-300" size={24} />
              <h4 className="font-semibold text-lg">Address</h4>
              <p className="text-green-200">Forester Canteen</p>
              <p className="text-green-200">Main Road, Forest Area</p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-green-700">
            <p className="text-green-300">&copy; 2025 Forester Canteen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;