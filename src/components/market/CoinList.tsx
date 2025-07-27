import React from 'react';
import { useCoins } from '@/hooks/useMarketData';
import { Coin } from '@/types/market.types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';

interface CoinListProps {
  filters?: {
    search?: string;
    sort_by?: 'name' | 'price' | 'market_cap' | 'price_change_24h';
    sort_order?: 'asc' | 'desc';
  };
}

const CoinList: React.FC<CoinListProps> = ({ filters }) => {
  const { data: coins, isLoading, error } = useCoins(filters);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading coins: {error.message}</p>
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No coins found</p>
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
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Cryptocurrency Market</h2>
        <p className="text-sm text-gray-600 mt-1">
          {coins.length} coins available for trading
        </p>
      </div>

      {/* Coin List */}
      <div className="divide-y divide-gray-200">
        {coins.map((coin: Coin) => (
          <div
            key={coin.coin_id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              {/* Coin Info */}
              <div className="flex items-center space-x-4">
                {/* Coin Icon Placeholder */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {coin.symbol.charAt(0)}
                  </span>
                </div>

                {/* Coin Details */}
                <div>
                  <h3 className="font-semibold text-gray-900">{coin.name}</h3>
                  <p className="text-sm text-gray-500">{coin.symbol}</p>
                  <p className="text-xs text-gray-400">Founder: {coin.founder}</p>
                </div>
              </div>

              {/* Price and Market Data */}
              <div className="flex items-center space-x-8">
                {/* Current Price */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(coin.current_price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supply: {coin.circulating_supply.toLocaleString()}
                  </p>
                </div>

                {/* 24h Change */}
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {getPriceChangeIcon(coin.price_change_24h)}
                    <span className={`font-medium ${getPriceChangeColor(coin.price_change_24h)}`}>
                      {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">24h change</p>
                </div>

                {/* Market Cap */}
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatMarketCap(coin.market_cap)}
                  </p>
                  <p className="text-xs text-gray-500">Market Cap</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Data updates in real-time • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default CoinList; 