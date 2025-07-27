import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import marketService from '@/services/market.service';
import { MarketFilters } from '@/types/market.types';

// Query keys for market data
export const marketQueryKeys = {
  all: ['market'] as const,
  coins: (filters?: MarketFilters) => [...marketQueryKeys.all, 'coins', filters] as const,
  coin: (id: string) => [...marketQueryKeys.all, 'coin', id] as const,
  marketStatus: () => [...marketQueryKeys.all, 'status'] as const,
  priceHistory: (coinId: string, timeRange: string) => 
    [...marketQueryKeys.all, 'priceHistory', coinId, timeRange] as const,
  marketData: () => [...marketQueryKeys.all, 'data'] as const,
  marketStats: () => [...marketQueryKeys.all, 'stats'] as const,
  trending: () => [...marketQueryKeys.all, 'trending'] as const,
  topGainers: () => [...marketQueryKeys.all, 'topGainers'] as const,
  topLosers: () => [...marketQueryKeys.all, 'topLosers'] as const,
  search: (query: string) => [...marketQueryKeys.all, 'search', query] as const,
  realTimePrices: (coinIds: string[]) => 
    [...marketQueryKeys.all, 'realTimePrices', coinIds] as const,
};

// Hook to get all coins with optional filtering
export const useCoins = (filters?: MarketFilters) => {
  return useQuery({
    queryKey: marketQueryKeys.coins(filters),
    queryFn: () => marketService.getCoins(filters),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get a specific coin
export const useCoin = (coinId: string) => {
  return useQuery({
    queryKey: marketQueryKeys.coin(coinId),
    queryFn: () => marketService.getCoin(coinId),
    enabled: !!coinId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get market status
export const useMarketStatus = () => {
  return useQuery({
    queryKey: marketQueryKeys.marketStatus(),
    queryFn: () => marketService.getMarketStatus(),
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to get price history for a specific coin
export const usePriceHistory = (
  coinId: string,
  timeRange: '1h' | '24h' | '7d' | '30d' | '1y' = '24h'
) => {
  return useQuery({
    queryKey: marketQueryKeys.priceHistory(coinId, timeRange),
    queryFn: () => marketService.getPriceHistory(coinId, timeRange),
    enabled: !!coinId,
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get comprehensive market data
export const useMarketData = () => {
  return useQuery({
    queryKey: marketQueryKeys.marketData(),
    queryFn: () => marketService.getMarketData(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get market statistics
export const useMarketStats = () => {
  return useQuery({
    queryKey: marketQueryKeys.marketStats(),
    queryFn: () => marketService.getMarketStats(),
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 120000, // Refetch every 2 minutes
  });
};

// Hook to get trending coins
export const useTrendingCoins = () => {
  return useQuery({
    queryKey: marketQueryKeys.trending(),
    queryFn: () => marketService.getTrendingCoins(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get top gainers
export const useTopGainers = () => {
  return useQuery({
    queryKey: marketQueryKeys.topGainers(),
    queryFn: () => marketService.getTopGainers(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get top losers
export const useTopLosers = () => {
  return useQuery({
    queryKey: marketQueryKeys.topLosers(),
    queryFn: () => marketService.getTopLosers(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to search coins
export const useSearchCoins = (query: string) => {
  return useQuery({
    queryKey: marketQueryKeys.search(query),
    queryFn: () => marketService.searchCoins(query),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get real-time prices (for WebSocket fallback)
export const useRealTimePrices = (coinIds: string[]) => {
  return useQuery({
    queryKey: marketQueryKeys.realTimePrices(coinIds),
    queryFn: () => marketService.getRealTimePrices(coinIds),
    enabled: coinIds.length > 0,
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

// Hook to invalidate market data queries
export const useInvalidateMarketData = () => {
  const queryClient = useQueryClient();

  return {
    invalidateCoins: (filters?: MarketFilters) => 
      queryClient.invalidateQueries({ queryKey: marketQueryKeys.coins(filters) }),
    invalidateCoin: (coinId: string) => 
      queryClient.invalidateQueries({ queryKey: marketQueryKeys.coin(coinId) }),
    invalidateMarketStatus: () => 
      queryClient.invalidateQueries({ queryKey: marketQueryKeys.marketStatus() }),
    invalidatePriceHistory: (coinId: string, timeRange: string) => 
      queryClient.invalidateQueries({ queryKey: marketQueryKeys.priceHistory(coinId, timeRange) }),
    invalidateAllMarketData: () => 
      queryClient.invalidateQueries({ queryKey: marketQueryKeys.all }),
  };
};

// Hook to prefetch market data
export const usePrefetchMarketData = () => {
  const queryClient = useQueryClient();

  return {
    prefetchCoin: (coinId: string) => 
      queryClient.prefetchQuery({
        queryKey: marketQueryKeys.coin(coinId),
        queryFn: () => marketService.getCoin(coinId),
      }),
    prefetchPriceHistory: (coinId: string, timeRange: string) => 
      queryClient.prefetchQuery({
        queryKey: marketQueryKeys.priceHistory(coinId, timeRange),
        queryFn: () => marketService.getPriceHistory(coinId, timeRange as any),
      }),
  };
}; 