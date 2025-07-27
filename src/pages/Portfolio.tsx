import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio, useHoldings, useBalance } from '@/hooks/usePortfolio';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, ArrowRight } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';

const Portfolio = () => {
  const navigate = useNavigate();
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = usePortfolio();
  const { data: holdings, isLoading: holdingsLoading, error: holdingsError } = useHoldings();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useBalance();

  const isLoading = portfolioLoading || holdingsLoading || balanceLoading;
  const error = portfolioError || holdingsError || balanceError;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const portfolioStats = [
    {
      name: 'Total Value',
      value: portfolio ? formatPrice(portfolio.total_value) : '£0.00',
      change: portfolio ? `${portfolio.total_profit_loss_percentage >= 0 ? '+' : ''}${portfolio.total_profit_loss_percentage.toFixed(2)}%` : '0%',
      changeType: portfolio && portfolio.total_profit_loss_percentage >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
    },
    {
      name: 'Total P&L',
      value: portfolio ? `${portfolio.total_profit_loss >= 0 ? '+' : ''}${formatPrice(portfolio.total_profit_loss)}` : '£0.00',
      change: portfolio ? `${portfolio.total_profit_loss_percentage >= 0 ? '+' : ''}${portfolio.total_profit_loss_percentage.toFixed(2)}%` : '0%',
      changeType: portfolio && portfolio.total_profit_loss >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
    },
    {
      name: 'Available Balance',
      value: balance ? formatPrice(balance.available_balance) : '£0.00',
      change: 'Available',
      changeType: 'neutral',
      icon: BarChart3,
    },
    {
      name: 'Total Coins',
      value: holdings ? holdings.length.toString() : '0',
      change: 'Active',
      changeType: 'neutral',
      icon: PieChart,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your cryptocurrency investments and performance.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-300">Error loading portfolio: {error.message}</p>
        </div>
      </div>
    );
  }

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
                  {holdings && holdings.length > 0 ? (
                    holdings.map((holding) => (
                      <tr 
                        key={holding.coin_id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => navigate(`/coin/${holding.coin_id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {holding.coin_symbol.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {holding.coin_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {holding.coin_symbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                          {holding.quantity.toFixed(8)} {holding.coin_symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatPrice(holding.average_buy_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatPrice(holding.current_value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-medium ${
                                holding.profit_loss >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {holding.profit_loss >= 0 ? '+' : ''}{formatPrice(holding.profit_loss)}
                            </span>
                            <span
                              className={`text-xs ${
                                holding.profit_loss_percentage >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {holding.profit_loss_percentage >= 0 ? '+' : ''}{holding.profit_loss_percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No coins in your portfolio yet. Start by buying some coins!
                      </td>
                    </tr>
                  )}
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
              {holdings && holdings.length > 0 ? (
                holdings.map((holding) => {
                  const percentage = portfolio ? ((holding.current_value / portfolio.total_value) * 100).toFixed(1) : '0';
                  return (
                    <div key={holding.coin_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-900 dark:text-white">{holding.coin_symbol}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No holdings to display
                </p>
              )}
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
              <button 
                onClick={() => navigate('/buy-sell')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                💰 Buy More
              </button>
              <button 
                onClick={() => navigate('/sell')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors"
              >
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