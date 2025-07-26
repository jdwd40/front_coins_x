import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart } from 'lucide-react';

const Portfolio = () => {
  const holdings = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      quantity: 0.25,
      averagePrice: 42000,
      currentPrice: 45000,
      currentValue: 11250,
      profitLoss: 750,
      profitLossPercentage: 7.14,
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      quantity: 2.5,
      averagePrice: 3000,
      currentPrice: 3200,
      currentValue: 8000,
      profitLoss: 500,
      profitLossPercentage: 6.67,
    },
    {
      id: '3',
      name: 'Cardano',
      symbol: 'ADA',
      quantity: 5000,
      averagePrice: 1.1,
      currentPrice: 1.25,
      currentValue: 6250,
      profitLoss: 750,
      profitLossPercentage: 13.64,
    },
    {
      id: '4',
      name: 'Solana',
      symbol: 'SOL',
      quantity: 25,
      averagePrice: 85,
      currentPrice: 95,
      currentValue: 2375,
      profitLoss: 250,
      profitLossPercentage: 11.76,
    },
  ];

  const portfolioStats = [
    {
      name: 'Total Value',
      value: '£27,875.00',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Total P&L',
      value: '+£2,250.00',
      change: '+8.8%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Best Performer',
      value: 'Cardano (ADA)',
      change: '+13.64%',
      changeType: 'positive',
      icon: BarChart3,
    },
    {
      name: 'Total Coins',
      value: '4',
      change: 'Active',
      changeType: 'neutral',
      icon: PieChart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your cryptocurrency investments and performance.
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat) => (
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
              ) : stat.changeType === 'negative' ? (
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              )}
              <span
                className={`text-sm font-medium ml-1 ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : stat.changeType === 'negative'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Holdings Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Holdings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {holdings.map((holding) => (
                    <tr key={holding.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {holding.symbol.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {holding.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {holding.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {holding.quantity} {holding.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        £{holding.averagePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        £{holding.currentValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${
                              holding.profitLoss >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {holding.profitLoss >= 0 ? '+' : ''}£{holding.profitLoss.toLocaleString()}
                          </span>
                          <span
                            className={`text-xs ${
                              holding.profitLossPercentage >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {holding.profitLossPercentage >= 0 ? '+' : ''}{holding.profitLossPercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { type: 'buy', coin: 'Bitcoin', amount: '0.05 BTC', value: '£2,250', date: '2 hours ago' },
                  { type: 'sell', coin: 'Ethereum', amount: '0.5 ETH', value: '£1,600', date: '1 day ago' },
                  { type: 'buy', coin: 'Cardano', amount: '1000 ADA', value: '£1,250', date: '3 days ago' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${transaction.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.coin}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.amount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="space-y-6">
          {/* Portfolio Allocation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Allocation</h3>
            <div className="space-y-3">
              {holdings.map((holding) => {
                const percentage = ((holding.currentValue / 27875) * 100).toFixed(1);
                return (
                  <div key={holding.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">{holding.symbol}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Chart coming soon...</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors">
                💰 Buy More
              </button>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors">
                📉 Sell
              </button>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 