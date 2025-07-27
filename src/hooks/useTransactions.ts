import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/trading.types';
import { useAuth } from './useAuth';

interface UseTransactionsOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useTransactions = (options: UseTransactionsOptions = {}): UseTransactionsReturn => {
  const { limit = 100, autoFetch = true } = options;
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.user_id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://jdwd40.com/api-2/api/transactions/user/${user.user_id}?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.transactions) {
        setTransactions(data.transactions);
      } else {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.user_id, limit]);

  const refetch = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch transactions when component mounts or user changes
  useEffect(() => {
    if (autoFetch && user?.user_id) {
      fetchTransactions();
    }
  }, [fetchTransactions, autoFetch, user?.user_id]);

  return {
    transactions,
    isLoading,
    error,
    refetch,
    clearError,
  };
}; 