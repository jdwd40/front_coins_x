import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useHoldings } from '@/hooks/usePortfolio';
import { PortfolioHolding } from '@/services/portfolio.service';
import { TrendingUp, TrendingDown, Minus, Search, ArrowLeft } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';
import TransactionConfirmationModal from '@/components/TransactionConfirmationModal';
import TransactionNotification from '@/components/TransactionNotification';
import transactionService from '@/services/transaction.service';

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: holdings, isLoading, error } = useHoldings();
  
  // Debug logging
  console.log('Holdings data in Sell page:', holdings);
  
  // State for coin selection and transaction
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal and notification state
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    amount: 0,
    quantity: 0,
    totalCost: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Filter holdings based on search query
  const filteredHoldings = holdings?.filter(holding =>
    holding.coin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holding.coin_symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate transaction estimates
  const calculateSellEstimate = () => {
    if (!selectedHolding || !quantity || parseFloat(quantity) <= 0) {
      return { amount: 0, totalCost: 0 };
    }

    const quantityValue = parseFloat(quantity);
    const fee = 2.25;
    const sellValue = quantityValue * selectedHolding.current_price;
    const totalCost = sellValue - fee;

    return { amount: sellValue, totalCost };
  };

  // Handle sell transaction
  const handleSellTransaction = () => {
    console.log('Sell transaction initiated:', { selectedHolding, quantity, user });
    
    if (!isAuthenticated || !user) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Authentication Required',
        message: 'Please sign in to make transactions.',
      });
      return;
    }

    if (!selectedHolding) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'No Coin Selected',
        message: 'Please select a coin to sell.',
      });
      return;
    }

    const quantityValue = parseFloat(quantity);
    console.log('Quantity value:', quantityValue);
    
    if (!quantityValue || quantityValue <= 0) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Invalid Quantity',
        message: 'Please enter a valid quantity greater than 0.',
      });
      return;
    }

    console.log('Available quantity:', selectedHolding.quantity, 'Requested quantity:', quantityValue);
    
    if (quantityValue > selectedHolding.quantity) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Insufficient Coins',
        message: `You only have ${selectedHolding.quantity.toFixed(8)} ${selectedHolding.coin_symbol} available to sell.`,
      });
      return;
    }

    const { amount, totalCost } = calculateSellEstimate();
    console.log('Transaction estimate:', { amount, totalCost, quantity: quantityValue });
    setConfirmationData({ amount, quantity: quantityValue, totalCost });
    setIsConfirmationOpen(true);
  };

  // Handle transaction confirmation
  const handleTransactionConfirm = async () => {
    if (!selectedHolding || !user) return;

    console.log('Confirming transaction:', {
      user_id: user.user_id,
      coin_id: selectedHolding.coin_id,
      amount: confirmationData.quantity,
      selectedHolding
    });

    setIsProcessing(true);
    try {
      const response = await transactionService.sellCoins({
        user_id: user.user_id,
        coin_id: selectedHolding.coin_id,
        amount: confirmationData.quantity,
      });

      if (response.status === 'success') {
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Sell Transaction Successful',
          message: `Successfully sold ${confirmationData.quantity.toFixed(8)} ${selectedHolding.coin_symbol}`,
        });
        setQuantity('');
        setIsConfirmationOpen(false);
        // Invalidate portfolio queries to refresh data
        // This would typically be done with queryClient.invalidateQueries
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Transaction Failed',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Close notification
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getProfitLossColor = (profitLoss: number) => {
    if (profitLoss > 0) {
      return 'text-green-600';
    } else if (profitLoss < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getProfitLossIcon = (profitLoss: number) => {
    if (profitLoss > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (profitLoss < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sell Coins</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-300">Error loading portfolio: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleTransactionConfirm}
        type="sell"
        coinName={selectedHolding?.coin_name || ''}
        coinSymbol={selectedHolding?.coin_symbol || ''}
        amount={confirmationData.amount}
        quantity={confirmationData.quantity}
        totalCost={confirmationData.totalCost}
        currentPrice={selectedHolding?.current_price || 0}
        isLoading={isProcessing}
      />

      {/* Transaction Notification */}
      <TransactionNotification
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sell Coins</h1>
      </div>

      {!isAuthenticated ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <Minus className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                Sign In Required
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                Please sign in to your account to sell coins.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Holdings</h2>
              
              {holdings && holdings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No coins in your portfolio</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Buy some coins first to start trading
                  </p>
                </div>
              ) : (
                <>
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search your holdings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Holdings Table */}
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Coin
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Current Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total Value
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            P&L
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredHoldings.map((holding) => (
                          <tr
                            key={holding.coin_id}
                            onClick={() => setSelectedHolding(holding)}
                            className={`cursor-pointer transition-colors ${
                              selectedHolding?.coin_id === holding.coin_id
                                ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-xs">
                                    {holding.coin_symbol.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {holding.coin_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                              {holding.coin_symbol}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {holding.quantity.toFixed(8)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatPrice(holding.current_price)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {formatPrice(holding.current_value)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                {getProfitLossIcon(holding.profit_loss)}
                                <span className={`text-sm font-medium ${getProfitLossColor(holding.profit_loss)}`}>
                                  {holding.profit_loss > 0 ? '+' : ''}{formatPrice(holding.profit_loss)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sell Form */}
          <div className="space-y-4">
            {selectedHolding ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4">
                  Sell {selectedHolding.coin_symbol}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                      Quantity to Sell
                    </label>
                    <input
                      type="number"
                      placeholder="0.00000000"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      max={selectedHolding.quantity}
                      min="0"
                      step="0.00000001"
                      className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Available: {typeof selectedHolding.quantity === 'number' ? selectedHolding.quantity.toFixed(8) : '0.00000000'} {selectedHolding.coin_symbol}
                    </p>
                  </div>

                  {/* Preview */}
                  {quantity && parseFloat(quantity) > 0 && (
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(selectedHolding.current_price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Sell Value:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(parseFloat(quantity) * selectedHolding.current_price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fee:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£2.25</span>
                      </div>
                      <hr className="border-gray-200 dark:border-gray-600" />
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">You'll Receive:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(parseFloat(quantity) * selectedHolding.current_price - 2.25)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSellTransaction}
                    disabled={!quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) > (typeof selectedHolding.quantity === 'number' ? selectedHolding.quantity : 0)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sell {selectedHolding.coin_symbol}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a coin from your holdings to sell
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell; 