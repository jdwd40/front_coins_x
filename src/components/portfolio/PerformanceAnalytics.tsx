import React, { useMemo } from 'react';
import { Transaction, Portfolio } from '@/types/trading.types';
import { 
  calculatePerformanceMetrics, 
  formatCurrency, 
  formatPercentage, 
  formatNumber,
  getProfitLossColor,
  PerformanceMetrics
} from '@/utils/analytics';

interface PerformanceAnalyticsProps {
  transactions: Transaction[];
  portfolio?: Portfolio;
  isLoading?: boolean;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  transactions,
  portfolio,
  isLoading = false,
}) => {
  const metrics = useMemo(() => {
    return calculatePerformanceMetrics(transactions, portfolio);
  }, [transactions, portfolio]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Performance Analytics
        </h2>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Trades"
            value={formatNumber(metrics.totalTrades)}
            subtitle={`${metrics.buyTrades} buys, ${metrics.sellTrades} sells`}
            color="blue"
          />
          <MetricCard
            title="Total Volume"
            value={formatCurrency(metrics.totalVolume)}
            subtitle={`Avg: ${formatCurrency(metrics.averageTradeSize)}`}
            color="green"
          />
          <MetricCard
            title="Total P&L"
            value={formatCurrency(metrics.totalProfitLoss)}
            subtitle={formatPercentage(metrics.totalProfitLossPercentage)}
            color={metrics.totalProfitLoss >= 0 ? 'green' : 'red'}
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate.toFixed(1)}%`}
            subtitle={`${metrics.sellTrades} sell trades`}
            color="purple"
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Returns Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Monthly Returns
            </h3>
            <MonthlyReturnsChart data={metrics.monthlyReturns} />
          </div>

          {/* Coin Performance Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Coin Performance
            </h3>
            <CoinPerformanceChart data={metrics.coinPerformance} />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trading Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Trading Statistics
            </h3>
            <div className="space-y-3">
              <StatRow label="Total Fees Paid" value={formatCurrency(metrics.totalFees)} />
              <StatRow label="Average Holding Time" value={`${metrics.averageHoldingTime.toFixed(1)} days`} />
              <StatRow 
                label="Best Performing Coin" 
                value={metrics.bestPerformingCoin || 'N/A'} 
                color="green"
              />
              <StatRow 
                label="Worst Performing Coin" 
                value={metrics.worstPerformingCoin || 'N/A'} 
                color="red"
              />
            </div>
          </div>

          {/* Top Coins by Volume */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Coins by Volume
            </h3>
            <TopCoinsList data={metrics.coinPerformance} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${textColors[color]} mt-1`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

// Stat Row Component
interface StatRowProps {
  label: string;
  value: string;
  color?: 'green' | 'red' | 'blue';
}

const StatRow: React.FC<StatRowProps> = ({ label, value, color }) => {
  const textColor = color ? `text-${color}-600` : 'text-gray-900';
  
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${textColor}`}>{value}</span>
    </div>
  );
};

// Monthly Returns Chart Component
interface MonthlyReturnsChartProps {
  data: PerformanceMetrics['monthlyReturns'];
}

const MonthlyReturnsChart: React.FC<MonthlyReturnsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No data available
      </div>
    );
  }

  const maxReturn = Math.max(...data.map(d => Math.abs(d.return)));

  return (
    <div className="space-y-2">
      {data.map((month) => {
        const height = maxReturn > 0 ? (Math.abs(month.return) / maxReturn) * 100 : 0;
        const isPositive = month.return >= 0;
        
        return (
          <div key={month.month} className="flex items-center space-x-2">
            <div className="w-16 text-xs text-gray-600">
              {new Date(month.month + '-01').toLocaleDateString('en-GB', { 
                month: 'short', 
                year: '2-digit' 
              })}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${
                  isPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${height}%`,
                  marginLeft: isPositive ? '0' : 'auto',
                  marginRight: isPositive ? 'auto' : '0'
                }}
              />
            </div>
            <div className={`w-16 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(month.return)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Coin Performance Chart Component
interface CoinPerformanceChartProps {
  data: PerformanceMetrics['coinPerformance'];
}

const CoinPerformanceChart: React.FC<CoinPerformanceChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No data available
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.totalProfitLossPercentage - a.totalProfitLossPercentage);
  const topCoins = sortedData.slice(0, 5);

  return (
    <div className="space-y-3">
      {topCoins.map((coin) => (
        <div key={coin.coinSymbol} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              {coin.coinSymbol}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{coin.coinSymbol}</div>
              <div className="text-xs text-gray-500">{coin.totalTrades} trades</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getProfitLossColor(coin.totalProfitLossPercentage)}`}>
              {formatPercentage(coin.totalProfitLossPercentage)}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(coin.totalProfitLoss)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Top Coins List Component
interface TopCoinsListProps {
  data: PerformanceMetrics['coinPerformance'];
}

const TopCoinsList: React.FC<TopCoinsListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No data available
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.totalVolume - a.totalVolume);
  const topCoins = sortedData.slice(0, 5);

  return (
    <div className="space-y-3">
      {topCoins.map((coin, index) => (
        <div key={coin.coinSymbol} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{coin.coinSymbol}</div>
              <div className="text-xs text-gray-500">{coin.coinName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(coin.totalVolume)}
            </div>
            <div className="text-xs text-gray-500">
              {coin.totalTrades} trades
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 