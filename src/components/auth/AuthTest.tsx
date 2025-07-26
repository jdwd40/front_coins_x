import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  const handleTestLogin = async () => {
    try {
      await login({
        email: 'test@example.com',
        password: 'password123',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleTestLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Authentication Status
        </h3>
        <p className="text-blue-700 dark:text-blue-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Authentication Test
      </h3>
      
      <div className="space-y-3">
        <div>
          <strong>Status:</strong>{' '}
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {user && (
          <div>
            <strong>User:</strong> {user.username} ({user.email})
          </div>
        )}
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="flex space-x-2">
          {!isAuthenticated ? (
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Login
            </button>
          ) : (
            <button
              onClick={handleTestLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Test Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 