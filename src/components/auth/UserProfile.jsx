import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:block text-sm font-medium">{user.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Signed in via {user.provider === 'google' ? 'Google' : 'Apple'}
              </p>
            </div>
            
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
