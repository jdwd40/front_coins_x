import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoin } from '@/hooks/useMarketData';
import { useAuth } from '@/context/AuthContext';
import { useCoinHolding } from '@/hooks/usePortfolio';
import { TrendingUp, TrendingDown, Minus, ArrowLeft, DollarSign, BarChart3, Users, Activity } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';

const CoinDetail: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: coin, isLoading, error } = useCoin(coinId || '');
  const { data: holding } = useCoinHolding(coinId ? parseInt(coinId) : 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coin Not Found</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-300">Error loading coin details: {error?.message}</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    }
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) {
      return 'text-green-600';
    } else if (change < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {coin.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{coin.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{coin.symbol}</p>
          </div>
        </div>
      </div>

      {/* Price Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(coin.current_price)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Change</p>
            <div className="flex items-center space-x-2">
              {getPriceChangeIcon(coin.price_change_24h)}
              <span className={`text-2xl font-bold ${getPriceChangeColor(coin.price_change_24h)}`}>
                {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMarketCap(coin.market_cap)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Circulating Supply</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{coin.circulating_supply.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          {/* Buy/Sell Action Buttons */}
          {isAuthenticated && (
            <div className="mb-6 space-y-4">
              {/* Portfolio Information */}
              {holding && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Your Holdings</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Quantity:</span>
                      <span className="ml-2 font-medium text-blue-800 dark:text-blue-300">
                        {holding.quantity.toFixed(8)} {coin.symbol}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Value:</span>
                      <span className="ml-2 font-medium text-blue-800 dark:text-blue-300">
                        {formatPrice(holding.current_value)}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">P&L:</span>
                      <span className={`ml-2 font-medium ${holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.profit_loss >= 0 ? '+' : ''}{formatPrice(holding.profit_loss)}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">P&L %:</span>
                      <span className={`ml-2 font-medium ${holding.profit_loss_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.profit_loss_percentage >= 0 ? '+' : ''}{holding.profit_loss_percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/buy-sell')}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  💰 Buy {coin.symbol}
                </button>
                {holding && holding.quantity > 0 && (
                  <button
                    onClick={() => navigate('/sell')}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    📉 Sell {coin.symbol}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Overview Content */}
          <div className="space-y-6">
            {/* Coin Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coin Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{coin.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Symbol</span>
                    <span className="font-medium text-gray-900 dark:text-white">{coin.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Founder</span>
                    <span className="font-medium text-gray-900 dark:text-white">{coin.founder}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Coin ID</span>
                    <span className="font-medium text-gray-900 dark:text-white">#{coin.coin_id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(coin.current_price)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{formatMarketCap(coin.market_cap)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-600 dark:text-gray-400">Circulating Supply</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{coin.circulating_supply.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                    </div>
                    <span className={`font-medium ${getPriceChangeColor(coin.price_change_24h)}`}>
                      {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Performance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Performance</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Price Chart Coming Soon</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Historical price data and charts will be available in the next update
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail; 