import React, { useState } from 'react';
import { ArrowLeft, Lock, User, UserPlus } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack, onSignIn, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!name.trim()) {
          setError('Name is required');
          setIsLoading(false);
          return;
        }
        result = await onSignUp(email, password, name);
      } else {
        result = await onSignIn(email, password);
      }

      if (result.success) {
        // Clear form and show success message
        setEmail('');
        setPassword('');
        setName('');
        
        // Wait a bit longer for auth state to update
        setTimeout(() => {
          onLogin(true);
        }, 1500);
      } else {
        setError(result.error || 'Authentication failed');
        onLogin(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      onLogin(false);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-green-600 hover:text-green-700 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-green-800">
            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
          </h2>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSignUp ? (
              <UserPlus className="text-green-600" size={24} />
            ) : (
              <Lock className="text-green-600" size={24} />
            )}
          </div>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Create a new admin account to manage the canteen menu'
              : 'Please enter your credentials to access the admin panel'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading 
              ? (isSignUp ? 'Creating Account...' : 'Logging in...') 
              : (isSignUp ? 'Create Account' : 'Login')
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : 'Need an admin account? Create one'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;