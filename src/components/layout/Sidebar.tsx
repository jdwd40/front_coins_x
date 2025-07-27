import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Trading', href: '/trading', icon: '💰' },
    { name: 'Buy & Sell', href: '/buy-sell', icon: '💱' },
    { name: 'Portfolio', href: '/portfolio', icon: '📈' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={clsx(
      'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Market Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Market Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400">Cycle</span>
                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">MILD_BOOM</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400">Trend</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Up</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
                            <button
                onClick={() => navigate('/buy-sell')}
                className="w-full px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                💰 Buy
              </button>
              <button
                onClick={() => navigate('/sell')}
                className="w-full px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                📉 Sell
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Quick Actions */}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/buy-sell')}
                className="w-full p-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                title="Buy & Sell"
              >
                💰
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 