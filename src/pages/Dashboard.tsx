import { TrendingUp, TrendingDown, Activity, DollarSign, Users, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Portfolio Value',
      value: '£12,450.67',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Active Trades',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Activity,
    },
    {
      name: 'Total Users',
      value: '1,234',
      change: '+5.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Market Cap',
      value: '£2.4M',
      change: '-2.1%',
      changeType: 'negative',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ml-1 ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Market Overview and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Market Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Current Cycle</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">MILD_BOOM</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Trend Direction</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-1" />
                Up
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Market Sentiment</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">Bullish</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
              💰 Buy Coins
            </button>
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
              📉 Sell Coins
            </button>
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 h-12 text-lg font-semibold shadow-lg hover:shadow-xl">
              📊 View Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400 font-medium">API Status</span>
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Connected
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400 font-medium">WebSocket</span>
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Database</span>
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 