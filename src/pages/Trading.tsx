import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { useCoins } from '@/hooks/useMarketData';
import { useAuth } from '@/context/AuthContext';
import { transactionService } from '@/services/transaction.service';
import TransactionConfirmationModal from '@/components/TransactionConfirmationModal';
import TransactionNotification from '@/components/TransactionNotification';
import CoinList from '@/components/market/CoinList';

interface TransactionData {
  amount: number;
  quantity: number;
  totalCost: number;
}

const Trading = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCoin, setSelectedCoin] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<TransactionData>({ amount: 0, quantity: 0, totalCost: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  const { user, isAuthenticated } = useAuth();
  const { data: coins, isLoading: coinsLoading, error: coinsError } = useCoins();

  // Get selected coin data
  const selectedCoinData = coins?.find(coin => coin.coin_id === selectedCoin);

  // Calculate transaction estimates
  const calculateTransactionEstimate = () => {
    if (!selectedCoinData) return { amount: 0, quantity: 0, totalCost: 0 };

    const feeRate = 0.005; // 0.5% fee
    let calculatedAmount = 0;
    let calculatedQuantity = 0;
    let totalCost = 0;

    if (activeTab === 'buy') {
      if (amount && parseFloat(amount) > 0) {
        calculatedAmount = parseFloat(amount);
        calculatedQuantity = calculatedAmount / selectedCoinData.current_price;
        totalCost = calculatedAmount * (1 + feeRate);
      } else if (quantity && parseFloat(quantity) > 0) {
        calculatedQuantity = parseFloat(quantity);
        calculatedAmount = calculatedQuantity * selectedCoinData.current_price;
        totalCost = calculatedAmount * (1 + feeRate);
      }
    } else {
      // Sell - only quantity matters
      if (quantity && parseFloat(quantity) > 0) {
        calculatedQuantity = parseFloat(quantity);
        calculatedAmount = calculatedQuantity * selectedCoinData.current_price;
        totalCost = calculatedAmount * (1 - feeRate); // Less fee for selling
      }
    }

    return { amount: calculatedAmount, quantity: calculatedQuantity, totalCost };
  };

  // Handle form submission
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

    if (!selectedCoin || !selectedCoinData) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'No Coin Selected',
        message: 'Please select a coin to trade.',
      });
      return;
    }

    const { amount: calculatedAmount, quantity: calculatedQuantity, totalCost } = calculateTransactionEstimate();
    
    if (calculatedQuantity <= 0) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount or quantity.',
      });
      return;
    }

    setConfirmationData({ amount: calculatedAmount, quantity: calculatedQuantity, totalCost });
    setIsConfirmationOpen(true);
  };

  // Handle transaction confirmation
  const handleTransactionConfirm = async () => {
    if (!selectedCoin || !selectedCoinData || !user) return;

    setIsProcessing(true);
    try {
      const response = activeTab === 'buy' 
        ? await transactionService.buyCoins({
            user_id: user.user_id,
            coin_id: selectedCoin,
            amount: confirmationData.quantity,
          })
        : await transactionService.sellCoins({
            user_id: user.user_id,
            coin_id: selectedCoin,
            amount: confirmationData.quantity,
          });

      if (response.status === 'success') {
        setNotification({
          isOpen: true,
          type: 'success',
          title: `${activeTab === 'buy' ? 'Buy' : 'Sell'} Transaction Successful`,
          message: `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${confirmationData.quantity.toFixed(8)} ${selectedCoinData.symbol}`,
        });
        setAmount('');
        setQuantity('');
        setIsConfirmationOpen(false);
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

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Update calculations when inputs change
  useEffect(() => {
    if (activeTab === 'buy' && amount && !quantity) {
      const calculatedQuantity = parseFloat(amount) / (selectedCoinData?.current_price || 1);
      setQuantity(calculatedQuantity.toFixed(8));
    } else if (activeTab === 'buy' && quantity && !amount) {
      const calculatedAmount = parseFloat(quantity) * (selectedCoinData?.current_price || 1);
      setAmount(calculatedAmount.toFixed(2));
    }
  }, [amount, quantity, selectedCoinData, activeTab]);

  const transactionEstimate = calculateTransactionEstimate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trading</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Buy and sell cryptocurrencies with real-time market data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Buy/Sell Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'buy'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                💰 Buy
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'sell'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📉 Sell
              </button>
            </div>

            {/* Buy Form */}
            {activeTab === 'buy' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Coin
                  </label>
                  <select 
                    value={selectedCoin || ''}
                    onChange={(e) => setSelectedCoin(Number(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a coin...</option>
                    {coins?.map((coin) => (
                      <option key={coin.coin_id} value={coin.coin_id}>
                        {coin.name} ({coin.symbol}) - {formatPrice(coin.current_price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (£)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0.00000000"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleTransaction}
                  disabled={!selectedCoin || !amount && !quantity}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Buy {selectedCoinData?.symbol || 'Coin'}
                </button>
              </div>
            )}

            {/* Sell Form */}
            {activeTab === 'sell' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Coin
                  </label>
                  <select 
                    value={selectedCoin || ''}
                    onChange={(e) => setSelectedCoin(Number(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a coin...</option>
                    {coins?.map((coin) => (
                      <option key={coin.coin_id} value={coin.coin_id}>
                        {coin.name} ({coin.symbol}) - {formatPrice(coin.current_price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0.00000000"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (£)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleTransaction}
                  disabled={!selectedCoin || !quantity}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Sell {selectedCoinData?.symbol || 'Coin'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            {selectedCoinData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Coin</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedCoinData.name} ({selectedCoinData.symbol})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatPrice(selectedCoinData.current_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {transactionEstimate.quantity > 0 ? `${transactionEstimate.quantity.toFixed(8)} ${selectedCoinData.symbol}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fee (0.5%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {transactionEstimate.amount > 0 ? formatPrice(transactionEstimate.amount * 0.005) : '-'}
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between">
                  <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {transactionEstimate.totalCost > 0 ? formatPrice(transactionEstimate.totalCost) : '-'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Select a coin to see order summary
              </p>
            )}
          </div>
        </div>

        {/* Market Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Market Overview</h2>
            {coinsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : coinsError ? (
              <p className="text-red-600 dark:text-red-400">Error loading market data</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Coins</span>
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {coins?.length || 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap</span>
                    <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {formatPrice(coins?.reduce((sum, coin) => sum + coin.market_cap, 0) || 0)}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Price</span>
                    <span className="text-yellow-600 dark:text-yellow-400">📊</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {coins && coins.length > 0 
                      ? formatPrice(coins.reduce((sum, coin) => sum + coin.current_price, 0) / coins.length)
                      : '-'
                    }
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Top Performer</span>
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                    {coins && coins.length > 0 
                      ? coins.reduce((max, coin) => coin.price_change_24h > max.price_change_24h ? coin : max).symbol
                      : '-'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Coin List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Coins</h2>
            </div>
            <CoinList />
          </div>
        </div>
      </div>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleTransactionConfirm}
        type={activeTab}
        coinName={selectedCoinData?.name || ''}
        coinSymbol={selectedCoinData?.symbol || ''}
        amount={confirmationData.amount}
        quantity={confirmationData.quantity}
        totalCost={confirmationData.totalCost}
        currentPrice={selectedCoinData?.current_price || 0}
        isLoading={isProcessing}
      />

      {/* Transaction Notification */}
      <TransactionNotification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Trading; 