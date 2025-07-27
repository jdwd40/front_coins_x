import React, { useState } from 'react';
import { TransactionHistory } from '@/components/portfolio/TransactionHistory';
import { PerformanceAnalytics } from '@/components/portfolio/PerformanceAnalytics';
import { ExportOptions } from '@/components/portfolio/ExportOptions';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types/trading.types';

export const TransactionHistoryPage: React.FC = () => {
  const { transactions, isLoading, error, refetch } = useTransactions({ limit: 100 });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'analytics' | 'export'>('history');

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // You could open a modal or navigate to a detail page here
    console.log('Selected transaction:', transaction);
  };

  const handleExport = (data: string | Blob, filename: string) => {
    // Custom export handler - you could send to server, email, etc.
    console.log('Exporting:', filename, data);
    
    // Default browser download behavior
    const blob = new Blob([data as string], {
      type: typeof data === 'string' ? 'text/plain' : 'application/octet-stream',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Transactions</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={refetch}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History & Analytics</h1>
          <p className="mt-2 text-gray-600">
            View your trading history, analyze performance, and export data
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance Analytics
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Export Data
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'history' && (
            <TransactionHistory
              transactions={transactions}
              isLoading={isLoading}
              onTransactionClick={handleTransactionClick}
            />
          )}

          {activeTab === 'analytics' && (
            <PerformanceAnalytics
              transactions={transactions}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'export' && (
            <ExportOptions
              transactions={transactions}
              onExport={handleExport}
            />
          )}
        </div>

        {/* Transaction Detail Modal (if needed) */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>ID:</strong> {selectedTransaction.transaction_id}</div>
                  <div><strong>Type:</strong> {selectedTransaction.type}</div>
                                      <div><strong>Coin:</strong> {selectedTransaction.coin_name} ({selectedTransaction.symbol})</div>
                  <div><strong>Quantity:</strong> {selectedTransaction.quantity}</div>
                  <div><strong>Price:</strong> £{selectedTransaction.price}</div>
                  <div><strong>Total:</strong> £{selectedTransaction.total_amount}</div>
                  <div><strong>Status:</strong> {selectedTransaction.status}</div>
                  <div><strong>Date:</strong> {new Date(selectedTransaction.created_at).toLocaleString()}</div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 