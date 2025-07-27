import { useQuery } from '@tanstack/react-query';
import portfolioService from '@/services/portfolio.service';

// Query keys for portfolio data
export const portfolioQueryKeys = {
  all: ['portfolio'] as const,
  portfolio: () => [...portfolioQueryKeys.all, 'data'] as const,
  holdings: () => [...portfolioQueryKeys.all, 'holdings'] as const,
  balance: () => [...portfolioQueryKeys.all, 'balance'] as const,
  coinHolding: (coinId: number) => [...portfolioQueryKeys.all, 'holding', coinId] as const,
};

// Hook to get user's portfolio
export const usePortfolio = () => {
  return useQuery({
    queryKey: portfolioQueryKeys.portfolio(),
    queryFn: () => portfolioService.getPortfolio(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get user's holdings
export const useHoldings = () => {
  return useQuery({
    queryKey: portfolioQueryKeys.holdings(),
    queryFn: () => portfolioService.getHoldings(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get user's balance
export const useBalance = () => {
  return useQuery({
    queryKey: portfolioQueryKeys.balance(),
    queryFn: () => portfolioService.getBalance(),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get a specific coin holding
export const useCoinHolding = (coinId: number) => {
  return useQuery({
    queryKey: portfolioQueryKeys.coinHolding(coinId),
    queryFn: () => portfolioService.getCoinHolding(coinId),
    enabled: !!coinId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}; 