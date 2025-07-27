import React from 'react';
import { useCoins, useMarketStatus, useMarketData } from '@/hooks/useMarketData';
import { usePortfolio, useBalance } from '@/hooks/useTrading';
import Skeleton from '@/components/ui/LoadingSkeleton';

const ApiTest: React.FC = () => {
  // Market data hooks
  const { data: coins, isLoading: coinsLoading, error: coinsError } = useCoins();
  const { data: marketStatus, isLoading: statusLoading, error: statusError } = useMarketStatus();
  const { data: marketData, isLoading: marketDataLoading, error: marketDataError } = useMarketData();

  // Trading data hooks
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = usePortfolio();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useBalance();

  if (coinsLoading || statusLoading || marketDataLoading || portfolioLoading || balanceLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">API Integration Test</h1>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>
      
      {/* Market Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Market Status</h2>
        {statusError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading market status: {statusError.message}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto">{JSON.stringify(marketStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Market Data */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Market Data</h2>
        {marketDataError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading market data: {marketDataError.message}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto">{JSON.stringify(marketData, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Coins */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coins (First 5)</h2>
        {coinsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading coins: {coinsError.message}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(coins?.slice(0, 5), null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
        {portfolioError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading portfolio: {portfolioError.message}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto">{JSON.stringify(portfolio, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Balance</h2>
        {balanceError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading balance: {balanceError.message}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto">{JSON.stringify(balance, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Test Summary</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ Market Status: {statusError ? 'Failed' : 'Success'}</li>
          <li>✅ Market Data: {marketDataError ? 'Failed' : 'Success'}</li>
          <li>✅ Coins: {coinsError ? 'Failed' : 'Success'}</li>
          <li>✅ Portfolio: {portfolioError ? 'Failed' : 'Success'}</li>
          <li>✅ Balance: {balanceError ? 'Failed' : 'Success'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest; 