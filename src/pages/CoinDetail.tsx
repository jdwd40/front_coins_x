import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoin } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown, Minus, ArrowLeft, DollarSign, BarChart3, Users, Activity } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';

const CoinDetail: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'trading'>('overview');
  
  const { data: coin, isLoading, error } = useCoin(coinId || '');

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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('trading')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trading'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Trading
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
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
          )}

          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {/* Buy Form */}
                 <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                   <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">Buy {coin.symbol}</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                         Amount (£)
                       </label>
                       <input
                         type="number"
                         placeholder="0.00"
                         className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                         Quantity ({coin.symbol})
                       </label>
                       <input
                         type="number"
                         placeholder="0.00000000"
                         className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                       />
                     </div>
                     <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors">
                       Buy {coin.symbol}
                     </button>
                   </div>
                 </div>

                 {/* Sell Form */}
                 <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                   <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4">Sell {coin.symbol}</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                         Quantity ({coin.symbol})
                       </label>
                       <input
                         type="number"
                         placeholder="0.00000000"
                         className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                         Amount (£)
                       </label>
                       <input
                         type="number"
                         placeholder="0.00"
                         className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                       />
                     </div>
                     <button className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 transition-colors">
                       Sell {coin.symbol}
                     </button>
                   </div>
                 </div>
              </div>

                             {/* Order Summary */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                 <div className="space-y-3">
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Coin</span>
                     <span className="font-medium text-gray-900 dark:text-white">{coin.name} ({coin.symbol})</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                     <span className="font-medium text-gray-900 dark:text-white">{formatPrice(coin.current_price)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600 dark:text-gray-400">Fee</span>
                     <span className="font-medium text-gray-900 dark:text-white">£2.25</span>
                   </div>
                   <hr className="border-gray-200 dark:border-gray-700" />
                   <div className="flex justify-between">
                     <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                     <span className="font-semibold text-gray-900 dark:text-white">£0.00</span>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetail; 