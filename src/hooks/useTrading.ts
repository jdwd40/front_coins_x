import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tradingService from '@/services/trading.service';
import { BuyOrderRequest, SellOrderRequest } from '@/types/trading.types';
import { toast } from 'react-hot-toast';

// Query keys for trading data
export const tradingQueryKeys = {
  all: ['trading'] as const,
  portfolio: () => [...tradingQueryKeys.all, 'portfolio'] as const,
  transactions: (page: number, limit: number, filters?: any) => 
    [...tradingQueryKeys.all, 'transactions', page, limit, filters] as const,
  transaction: (id: string) => [...tradingQueryKeys.all, 'transaction', id] as const,
  orders: (page: number, limit: number, filters?: any) => 
    [...tradingQueryKeys.all, 'orders', page, limit, filters] as const,
  order: (id: string) => [...tradingQueryKeys.all, 'order', id] as const,
  orderConfirmation: (id: string) => [...tradingQueryKeys.all, 'orderConfirmation', id] as const,
  tradingStats: () => [...tradingQueryKeys.all, 'stats'] as const,
  balance: () => [...tradingQueryKeys.all, 'balance'] as const,
  coinHolding: (coinId: string) => [...tradingQueryKeys.all, 'holding', coinId] as const,
  orderEstimate: (coinId: string, quantity: number, type: string) => 
    [...tradingQueryKeys.all, 'estimate', coinId, quantity, type] as const,
};

// Hook to get user's portfolio
export const usePortfolio = () => {
  return useQuery({
    queryKey: tradingQueryKeys.portfolio(),
    queryFn: () => tradingService.getPortfolio(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get transaction history
export const useTransactionHistory = (
  page: number = 1,
  limit: number = 20,
  filters?: {
    type?: 'buy' | 'sell';
    coin_id?: string;
    status?: 'pending' | 'completed' | 'failed' | 'cancelled';
    start_date?: string;
    end_date?: string;
  }
) => {
  return useQuery({
    queryKey: tradingQueryKeys.transactions(page, limit, filters),
    queryFn: () => tradingService.getTransactionHistory(page, limit, filters),
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a specific transaction
export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: tradingQueryKeys.transaction(transactionId),
    queryFn: () => tradingService.getTransaction(transactionId),
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook to get order history
export const useOrderHistory = (
  page: number = 1,
  limit: number = 20,
  filters?: {
    type?: 'buy' | 'sell';
    coin_id?: string;
    status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  }
) => {
  return useQuery({
    queryKey: tradingQueryKeys.orders(page, limit, filters),
    queryFn: () => tradingService.getOrderHistory(page, limit, filters),
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a specific order
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: tradingQueryKeys.order(orderId),
    queryFn: () => tradingService.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook to get order confirmation
export const useOrderConfirmation = (orderId: string) => {
  return useQuery({
    queryKey: tradingQueryKeys.orderConfirmation(orderId),
    queryFn: () => tradingService.getOrderConfirmation(orderId),
    enabled: !!orderId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get trading statistics
export const useTradingStats = () => {
  return useQuery({
    queryKey: tradingQueryKeys.tradingStats(),
    queryFn: () => tradingService.getTradingStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get user balance
export const useBalance = () => {
  return useQuery({
    queryKey: tradingQueryKeys.balance(),
    queryFn: () => tradingService.getBalance(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get coin holding
export const useCoinHolding = (coinId: string) => {
  return useQuery({
    queryKey: tradingQueryKeys.coinHolding(coinId),
    queryFn: () => tradingService.getCoinHolding(coinId),
    enabled: !!coinId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get order estimate
export const useOrderEstimate = (
  coinId: string,
  quantity: number,
  type: 'buy' | 'sell'
) => {
  return useQuery({
    queryKey: tradingQueryKeys.orderEstimate(coinId, quantity, type),
    queryFn: () => tradingService.getOrderEstimate(coinId, quantity, type),
    enabled: !!coinId && quantity > 0,
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation to place a buy order
export const usePlaceBuyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: BuyOrderRequest) => tradingService.placeBuyOrder(orderData),
    onSuccess: (data) => {
      toast.success(`Buy order placed successfully! Order ID: ${data.id}`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.portfolio() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.balance() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.transactions(1, 20) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orders(1, 20) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to place buy order: ${error.message}`);
    },
  });
};

// Mutation to place a sell order
export const usePlaceSellOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: SellOrderRequest) => tradingService.placeSellOrder(orderData),
    onSuccess: (data) => {
      toast.success(`Sell order placed successfully! Order ID: ${data.id}`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.portfolio() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.balance() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.transactions(1, 20) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orders(1, 20) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to place sell order: ${error.message}`);
    },
  });
};

// Mutation to cancel an order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => tradingService.cancelOrder(orderId),
    onSuccess: (data) => {
      toast.success(`Order cancelled successfully! Order ID: ${data.id}`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.portfolio() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.balance() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.transactions(1, 20) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orders(1, 20) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.order(data.id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel order: ${error.message}`);
    },
  });
};

// Hook to invalidate trading data queries
export const useInvalidateTradingData = () => {
  const queryClient = useQueryClient();

  return {
    invalidatePortfolio: () => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.portfolio() }),
    invalidateTransactions: (page?: number, limit?: number, filters?: any) => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.transactions(page || 1, limit || 20, filters) }),
    invalidateOrders: (page?: number, limit?: number, filters?: any) => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orders(page || 1, limit || 20, filters) }),
    invalidateOrder: (orderId: string) => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.order(orderId) }),
    invalidateBalance: () => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.balance() }),
    invalidateCoinHolding: (coinId: string) => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.coinHolding(coinId) }),
    invalidateAllTradingData: () => 
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.all }),
  };
};

// Hook to prefetch trading data
export const usePrefetchTradingData = () => {
  const queryClient = useQueryClient();

  return {
    prefetchPortfolio: () => 
      queryClient.prefetchQuery({
        queryKey: tradingQueryKeys.portfolio(),
        queryFn: () => tradingService.getPortfolio(),
      }),
    prefetchBalance: () => 
      queryClient.prefetchQuery({
        queryKey: tradingQueryKeys.balance(),
        queryFn: () => tradingService.getBalance(),
      }),
    prefetchTransactionHistory: (page: number = 1, limit: number = 20) => 
      queryClient.prefetchQuery({
        queryKey: tradingQueryKeys.transactions(page, limit),
        queryFn: () => tradingService.getTransactionHistory(page, limit),
      }),
  };
}; 