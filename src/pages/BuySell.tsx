import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCoins } from '@/hooks/useMarketData';
import { Coin } from '@/types/market.types';
import { TrendingUp, TrendingDown, Minus, Search, ArrowLeft } from 'lucide-react';
import Skeleton from '@/components/ui/LoadingSkeleton';
import TransactionConfirmationModal from '@/components/TransactionConfirmationModal';
import TransactionNotification from '@/components/TransactionNotification';
import transactionService from '@/services/transaction.service';

const BuySell: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: coins, isLoading, error } = useCoins();
  
  // State for coin selection and transaction
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
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

  // Filter coins based on search query
  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate transaction estimates
  const calculateTransactionEstimate = () => {
    if (!selectedCoin || !amount || parseFloat(amount) <= 0) {
      return { quantity: 0, totalCost: 0 };
    }

    const amountValue = parseFloat(amount);
    const fee = 2.25;

    if (transactionType === 'buy') {
      const quantity = amountValue / selectedCoin.current_price;
      const totalCost = amountValue + fee;
      return { quantity, totalCost };
    } else {
      // For sell, amount represents quantity
      const quantity = amountValue;
      const sellValue = quantity * selectedCoin.current_price;
      return { quantity, totalCost: sellValue };
    }
  };

  // Handle transaction
  const handleTransaction = () => {
    if (!isAuthenticated || !user) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Authentication Required',
        message: 'Please sign in to make transactions.',
      });
      return;
    }

    if (!selectedCoin) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'No Coin Selected',
        message: 'Please select a coin to trade.',
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount greater than 0.',
      });
      return;
    }

    const { quantity, totalCost } = calculateTransactionEstimate();
    setConfirmationData({ amount: amountValue, quantity, totalCost });
    setIsConfirmationOpen(true);
  };

  // Handle transaction confirmation
  const handleTransactionConfirm = async () => {
    if (!selectedCoin || !user) return;

    setIsProcessing(true);
    try {
      if (transactionType === 'buy') {
        const response = await transactionService.buyCoins({
          user_id: user.user_id,
          coin_id: selectedCoin.coin_id,
          amount: confirmationData.amount,
        });

        if (response.status === 'success') {
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Buy Transaction Successful',
            message: `Successfully purchased ${confirmationData.quantity.toFixed(8)} ${selectedCoin.symbol}`,
          });
          setAmount('');
          setIsConfirmationOpen(false);
        } else {
          throw new Error(response.message);
        }
      } else {
        const response = await transactionService.sellCoins({
          user_id: user.user_id,
          coin_id: selectedCoin.coin_id,
          amount: confirmationData.quantity,
        });

        if (response.status === 'success') {
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Sell Transaction Successful',
            message: `Successfully sold ${confirmationData.quantity.toFixed(8)} ${selectedCoin.symbol}`,
          });
          setAmount('');
          setIsConfirmationOpen(false);
        } else {
          throw new Error(response.message);
        }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buy & Sell</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-300">Error loading coins: {error.message}</p>
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
        type={transactionType}
        coinName={selectedCoin?.name || ''}
        coinSymbol={selectedCoin?.symbol || ''}
        amount={confirmationData.amount}
        quantity={confirmationData.quantity}
        totalCost={confirmationData.totalCost}
        currentPrice={selectedCoin?.current_price || 0}
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buy & Sell</h1>
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
                Please sign in to your account to buy and sell coins.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coin Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select a Coin</h2>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search coins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Coin List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCoins.map((coin) => (
                  <div
                    key={coin.coin_id}
                    onClick={() => setSelectedCoin(coin)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCoin?.coin_id === coin.coin_id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {coin.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{coin.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(coin.current_price)}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getPriceChangeIcon(coin.price_change_24h)}
                          <span className={`text-sm ${getPriceChangeColor(coin.price_change_24h)}`}>
                            {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="space-y-4">
            {selectedCoin ? (
              <>
                {/* Transaction Type Toggle */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTransactionType('buy')}
                      className={`py-2 px-4 rounded-md font-medium transition-colors ${
                        transactionType === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTransactionType('sell')}
                      className={`py-2 px-4 rounded-md font-medium transition-colors ${
                        transactionType === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Transaction Form */}
                <div className={`rounded-lg p-6 ${
                  transactionType === 'buy' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    transactionType === 'buy'
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {transactionType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin.symbol}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        transactionType === 'buy'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {transactionType === 'buy' ? 'Amount (£)' : 'Quantity'}
                      </label>
                      <input
                        type="number"
                        placeholder={transactionType === 'buy' ? '0.00' : '0.00000000'}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          transactionType === 'buy'
                            ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                            : 'border-red-300 dark:border-red-600 focus:ring-red-500'
                        }`}
                      />
                    </div>

                    {/* Preview */}
                    {amount && parseFloat(amount) > 0 && (
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(selectedCoin.current_price)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {transactionType === 'buy' ? 'Quantity:' : 'Amount:'}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {transactionType === 'buy' 
                              ? `${(parseFloat(amount) / selectedCoin.current_price).toFixed(8)} ${selectedCoin.symbol}`
                              : formatPrice(parseFloat(amount) * selectedCoin.current_price)
                            }
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Fee:</span>
                          <span className="font-medium text-gray-900 dark:text-white">£2.25</span>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-600" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900 dark:text-white">Total:</span>
                          <span className="text-gray-900 dark:text-white">
                            {transactionType === 'buy' 
                              ? formatPrice(parseFloat(amount) + 2.25)
                              : formatPrice(parseFloat(amount) * selectedCoin.current_price - 2.25)
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleTransaction}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className={`w-full py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        transactionType === 'buy'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {transactionType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin.symbol}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a coin to start trading
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySell; 