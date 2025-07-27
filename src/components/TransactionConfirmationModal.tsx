import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'buy' | 'sell';
  coinName: string;
  coinSymbol: string;
  amount: number;
  quantity: number;
  totalCost: number;
  currentPrice: number;
  isLoading?: boolean;
}

const TransactionConfirmationModal: React.FC<TransactionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  coinName,
  coinSymbol,
  amount,
  quantity,
  totalCost,
  currentPrice,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'buy' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {type === 'buy' ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm {type === 'buy' ? 'Buy' : 'Sell'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {type === 'buy' ? 'Purchase' : 'Sell'} {coinSymbol}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Coin</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {coinName} ({coinSymbol})
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Current Price</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                {type === 'buy' ? 'Amount (£)' : 'Quantity'}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {type === 'buy' ? formatPrice(amount) : `${quantity.toFixed(8)} ${coinSymbol}`}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                {type === 'buy' ? 'Quantity' : 'Amount (£)'}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {type === 'buy' ? `${quantity.toFixed(8)} ${coinSymbol}` : formatPrice(amount)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">£2.25</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPrice(totalCost)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Transaction Confirmation
                </p>
                <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                  Please review the transaction details above. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              type === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Confirm ${type === 'buy' ? 'Buy' : 'Sell'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmationModal; 