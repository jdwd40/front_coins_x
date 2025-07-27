import { Transaction, Portfolio } from '@/types/trading.types';

// Performance Analytics Types
export interface PerformanceMetrics {
  totalTrades: number;
  buyTrades: number;
  sellTrades: number;
  totalVolume: number;
  totalFees: number;
  averageTradeSize: number;
  winRate: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  bestPerformingCoin: string;
  worstPerformingCoin: string;
  averageHoldingTime: number;
  monthlyReturns: MonthlyReturn[];
  coinPerformance: CoinPerformance[];
}

export interface MonthlyReturn {
  month: string;
  return: number;
  trades: number;
  volume: number;
}

export interface CoinPerformance {
  coinSymbol: string;
  coinName: string;
  totalTrades: number;
  totalVolume: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  averagePrice: number;
  bestTrade: number;
  worstTrade: number;
}

export interface TransactionFilters {
  type?: 'buy' | 'sell';
  coinSymbol?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
}

// Calculate performance metrics from transactions
export const calculatePerformanceMetrics = (
  transactions: Transaction[],
  portfolio?: Portfolio
): PerformanceMetrics => {
  if (!transactions.length) {
    return {
      totalTrades: 0,
      buyTrades: 0,
      sellTrades: 0,
      totalVolume: 0,
      totalFees: 0,
      averageTradeSize: 0,
      winRate: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      bestPerformingCoin: '',
      worstPerformingCoin: '',
      averageHoldingTime: 0,
      monthlyReturns: [],
      coinPerformance: [],
    };
  }

  const buyTrades = transactions.filter(t => t.type === 'BUY');
  const sellTrades = transactions.filter(t => t.type === 'SELL');
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0);
  const totalFees = transactions.reduce(() => 0, 0); // No fee field in API response
  const averageTradeSize = totalVolume / transactions.length;

  // Calculate profit/loss from portfolio if available
  let totalProfitLoss = 0;
  let totalProfitLossPercentage = 0;
  
  if (portfolio) {
    totalProfitLoss = portfolio.total_profit_loss;
    totalProfitLossPercentage = portfolio.total_profit_loss_percentage;
  }

  // Calculate win rate (simplified - trades with positive P&L)
  const profitableTrades = transactions.filter(t => {
    // This is a simplified calculation - in reality you'd need more complex logic
    return t.type === 'SELL' && t.total_amount > 0;
  });
  const winRate = (profitableTrades.length / sellTrades.length) * 100;

  // Calculate monthly returns
  const monthlyReturns = calculateMonthlyReturns(transactions);

  // Calculate coin performance
  const coinPerformance = calculateCoinPerformance(transactions);

  // Find best and worst performing coins
  const bestPerformingCoin = coinPerformance.length > 0 
    ? coinPerformance.reduce((best, current) => 
        current.totalProfitLossPercentage > best.totalProfitLossPercentage ? current : best
      ).coinSymbol
    : '';

  const worstPerformingCoin = coinPerformance.length > 0
    ? coinPerformance.reduce((worst, current) => 
        current.totalProfitLossPercentage < worst.totalProfitLossPercentage ? current : worst
      ).coinSymbol
    : '';

  // Calculate average holding time (simplified)
  const averageHoldingTime = calculateAverageHoldingTime(transactions);

  return {
    totalTrades: transactions.length,
    buyTrades: buyTrades.length,
    sellTrades: sellTrades.length,
    totalVolume,
    totalFees,
    averageTradeSize,
    winRate: isNaN(winRate) ? 0 : winRate,
    totalProfitLoss,
    totalProfitLossPercentage,
    bestPerformingCoin,
    worstPerformingCoin,
    averageHoldingTime,
    monthlyReturns,
    coinPerformance,
  };
};

// Calculate monthly returns
export const calculateMonthlyReturns = (transactions: Transaction[]): MonthlyReturn[] => {
  const monthlyData = new Map<string, { trades: number; volume: number; profitLoss: number }>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = monthlyData.get(monthKey) || { trades: 0, volume: 0, profitLoss: 0 };
    existing.trades += 1;
    existing.volume += Number(transaction.total_amount);
    
    // Simplified profit/loss calculation
    if (transaction.type === 'SELL') {
      existing.profitLoss += Number(transaction.total_amount);
    } else {
      existing.profitLoss -= Number(transaction.total_amount);
    }
    
    monthlyData.set(monthKey, existing);
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      return: data.profitLoss,
      trades: data.trades,
      volume: data.volume,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Calculate performance by coin
export const calculateCoinPerformance = (transactions: Transaction[]): CoinPerformance[] => {
  const coinData = new Map<string, {
    tradeCount: number;
    volume: number;
    totalBuyAmount: number;
    totalSellAmount: number;
    totalBuyQuantity: number;
    totalSellQuantity: number;
    transactionList: Transaction[];
  }>();

  transactions.forEach(transaction => {
    const coinKey = transaction.symbol;
    const existing = coinData.get(coinKey) || {
      tradeCount: 0,
      volume: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
      totalBuyQuantity: 0,
      totalSellQuantity: 0,
      transactionList: [],
    };

    existing.tradeCount += 1;
    existing.volume += Number(transaction.total_amount);
    existing.transactionList.push(transaction);

    if (transaction.type === 'BUY') {
      existing.totalBuyAmount += Number(transaction.total_amount);
      existing.totalBuyQuantity += Number(transaction.quantity);
    } else {
      existing.totalSellAmount += Number(transaction.total_amount);
      existing.totalSellQuantity += Number(transaction.quantity);
    }

    coinData.set(coinKey, existing);
  });

  return Array.from(coinData.entries()).map(([coinSymbol, data]) => {
    const averagePrice = data.volume / data.tradeCount;
    const totalProfitLoss = data.totalSellAmount - data.totalBuyAmount;
    const totalProfitLossPercentage = data.totalBuyAmount > 0 
      ? (totalProfitLoss / data.totalBuyAmount) * 100 
      : 0;

    // Calculate best and worst trades
    const sellTrades = data.transactionList.filter((t: Transaction) => t.type === 'SELL');
    const bestTrade = sellTrades.length > 0 
      ? Math.max(...sellTrades.map((t: Transaction) => Number(t.total_amount)))
      : 0;
    const worstTrade = sellTrades.length > 0
      ? Math.min(...sellTrades.map((t: Transaction) => Number(t.total_amount)))
      : 0;

    return {
      coinSymbol,
      coinName: data.transactionList[0]?.coin_name || coinSymbol,
      totalTrades: data.tradeCount,
      totalVolume: data.volume,
      totalProfitLoss,
      totalProfitLossPercentage,
      averagePrice,
      bestTrade,
      worstTrade,
    };
  });
};

// Calculate average holding time (simplified)
export const calculateAverageHoldingTime = (transactions: Transaction[]): number => {
  
  // Group transactions by coin and find buy-sell pairs
  const coinTransactions = new Map<string, Transaction[]>();
  
  transactions.forEach(transaction => {
    const coinKey = transaction.symbol;
    if (!coinTransactions.has(coinKey)) {
      coinTransactions.set(coinKey, []);
    }
    coinTransactions.get(coinKey)!.push(transaction);
  });

  let totalHoldingTime = 0;
  let pairCount = 0;

  coinTransactions.forEach(coinTrades => {
    const sortedTrades = coinTrades.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    for (let i = 0; i < sortedTrades.length - 1; i++) {
      const current = sortedTrades[i];
      const next = sortedTrades[i + 1];

      if (current.type === 'BUY' && next.type === 'SELL') {
        const holdingTime = new Date(next.created_at).getTime() - new Date(current.created_at).getTime();
        totalHoldingTime += holdingTime;
        pairCount++;
      }
    }
  });

  return pairCount > 0 ? totalHoldingTime / pairCount / (1000 * 60 * 60 * 24) : 0; // Return in days
};

// Filter transactions based on criteria
export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter(transaction => {
    // Filter by type
    if (filters.type && transaction.type.toLowerCase() !== filters.type) {
      return false;
    }

    // Filter by coin symbol
    if (filters.coinSymbol && !transaction.symbol.toLowerCase().includes(filters.coinSymbol.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom) {
      const transactionDate = new Date(transaction.created_at);
      const fromDate = new Date(filters.dateFrom);
      if (transactionDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const transactionDate = new Date(transaction.created_at);
      const toDate = new Date(filters.dateTo);
      if (transactionDate > toDate) {
        return false;
      }
    }

    // Filter by amount range
    if (filters.minAmount && transaction.total_amount < filters.minAmount) {
      return false;
    }

    if (filters.maxAmount && transaction.total_amount > filters.maxAmount) {
      return false;
    }

    // Filter by status
    if (filters.status && transaction.status !== filters.status) {
      return false;
    }

    return true;
  });
};

// Search transactions by text
export const searchTransactions = (
  transactions: Transaction[],
  searchTerm: string
): Transaction[] => {
  if (!searchTerm.trim()) {
    return transactions;
  }

  const term = searchTerm.toLowerCase();
  return transactions.filter(transaction => 
    transaction.coin_name.toLowerCase().includes(term) ||
    transaction.symbol.toLowerCase().includes(term) ||
    transaction.transaction_id.toLowerCase().includes(term) ||
    transaction.type.toLowerCase().includes(term)
  );
};

// Paginate transactions
export const paginateTransactions = (
  transactions: Transaction[],
  page: number,
  limit: number
): { transactions: Transaction[]; pagination: { page: number; limit: number; total: number; totalPages: number } } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  return {
    transactions: paginatedTransactions,
    pagination: {
      page,
      limit,
      total: transactions.length,
      totalPages: Math.ceil(transactions.length / limit),
    },
  };
};

// Export transactions to different formats
export const exportTransactions = (
  transactions: Transaction[],
  format: 'json' | 'csv' | 'pdf' = 'json'
): string | Blob => {
  switch (format) {
    case 'json':
      return JSON.stringify(transactions, null, 2);
    
    case 'csv':
      const headers = [
        'Transaction ID',
        'Type',
        'Coin Name',
        'Coin Symbol',
        'Quantity',
        'Price',
        'Total Amount',
        'Fee',
        'Status',
        'Date'
      ];
      
      const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
          t.transaction_id,
          t.type,
          `"${t.coin_name}"`,
          t.symbol,
          Number(t.quantity).toFixed(6),
          Number(t.price).toFixed(2),
          Number(t.total_amount).toFixed(2),
          0, // No fee field in API response
          t.status || '',
          new Date(t.created_at).toISOString()
        ].join(','))
      ].join('\n');
      
      return csvContent;
    
    case 'pdf':
      // For PDF export, we'd need a PDF library like jsPDF
      // This is a placeholder - you'd implement actual PDF generation
      throw new Error('PDF export not implemented yet');
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Format currency for display
export const formatCurrency = (amount: number, currency = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format percentage for display
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format number for display
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-GB').format(value);
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get color for profit/loss values
export const getProfitLossColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Get background color for profit/loss values
export const getProfitLossBgColor = (value: number): string => {
  if (value > 0) return 'bg-green-50';
  if (value < 0) return 'bg-red-50';
  return 'bg-gray-50';
}; 