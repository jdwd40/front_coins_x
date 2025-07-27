import apiService from './api';
import {
  Transaction,
  Order,
  BuyOrderRequest,
  SellOrderRequest,
  OrderConfirmation,
  Portfolio,
  TransactionListResponse,
  OrderListResponse,
  OrderResponse,
  TransactionResponse,
  PortfolioResponse,
  TradingStats,
  TradingStatsResponse,
} from '@/types/trading.types';

class TradingService {
  // Place a buy order
  async placeBuyOrder(orderData: BuyOrderRequest): Promise<Order> {
    try {
      const response = await apiService.post<OrderResponse>('/api/trading/buy', orderData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to place buy order');
    } catch (error) {
      console.error('Error placing buy order:', error);
      throw error;
    }
  }

  // Place a sell order
  async placeSellOrder(orderData: SellOrderRequest): Promise<Order> {
    try {
      const response = await apiService.post<OrderResponse>('/api/trading/sell', orderData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to place sell order');
    } catch (error) {
      console.error('Error placing sell order:', error);
      throw error;
    }
  }

  // Get order confirmation details
  async getOrderConfirmation(orderId: string): Promise<OrderConfirmation> {
    try {
      const response = await apiService.get<{ success: boolean; data: OrderConfirmation; message?: string }>(
        `/api/trading/orders/${orderId}/confirmation`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get order confirmation');
    } catch (error) {
      console.error('Error getting order confirmation:', error);
      throw error;
    }
  }

  // Get user's transaction history
  async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: 'buy' | 'sell';
      coin_id?: string;
      status?: 'pending' | 'completed' | 'failed' | 'cancelled';
      start_date?: string;
      end_date?: string;
    }
  ): Promise<{ transactions: Transaction[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.coin_id) {
        params.append('coin_id', filters.coin_id);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters?.end_date) {
        params.append('end_date', filters.end_date);
      }

      const response = await apiService.get<TransactionListResponse>(`/api/trading/transactions?${params.toString()}`);
      
      if (response.success && response.data) {
        return {
          transactions: response.data,
          pagination: response.pagination || { page, limit, total: 0, total_pages: 0 },
        };
      }
      
      throw new Error(response.message || 'Failed to fetch transaction history');
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Get user's order history
  async getOrderHistory(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: 'buy' | 'sell';
      coin_id?: string;
      status?: 'pending' | 'completed' | 'failed' | 'cancelled';
    }
  ): Promise<{ orders: Order[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.coin_id) {
        params.append('coin_id', filters.coin_id);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const response = await apiService.get<OrderListResponse>(`/api/trading/orders?${params.toString()}`);
      
      if (response.success && response.data) {
        return {
          orders: response.data,
          pagination: response.pagination || { page, limit, total: 0, total_pages: 0 },
        };
      }
      
      throw new Error(response.message || 'Failed to fetch order history');
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }

  // Get a specific transaction
  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiService.get<TransactionResponse>(`/api/trading/transactions/${transactionId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch transaction');
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  // Get a specific order
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiService.get<OrderResponse>(`/api/trading/orders/${orderId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch order');
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiService.patch<OrderResponse>(`/api/trading/orders/${orderId}/cancel`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to cancel order');
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  // Get user's portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const response = await apiService.get<PortfolioResponse>('/api/trading/portfolio');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch portfolio');
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  // Get trading statistics
  async getTradingStats(): Promise<TradingStats> {
    try {
      const response = await apiService.get<TradingStatsResponse>('/api/trading/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch trading stats');
    } catch (error) {
      console.error('Error fetching trading stats:', error);
      throw error;
    }
  }

  // Get available balance
  async getBalance(): Promise<{ available_balance: number; total_balance: number }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { available_balance: number; total_balance: number }; message?: string }>(
        '/api/trading/balance'
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch balance');
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  // Get coin holdings for a specific coin
  async getCoinHolding(coinId: string): Promise<{
    coin_id: string;
    coin_name: string;
    coin_symbol: string;
    quantity: number;
    average_buy_price: number;
    current_price: number;
    current_value: number;
    profit_loss: number;
    profit_loss_percentage: number;
  }> {
    try {
      const response = await apiService.get<{ success: boolean; data: any; message?: string }>(
        `/api/trading/holdings/${coinId}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch coin holding');
    } catch (error) {
      console.error('Error fetching coin holding:', error);
      throw error;
    }
  }

  // Get estimated order value (for preview)
  async getOrderEstimate(
    coinId: string,
    quantity: number,
    type: 'buy' | 'sell'
  ): Promise<{
    estimated_total: number;
    fee: number;
    final_total: number;
    current_price: number;
  }> {
    try {
      const response = await apiService.get<{ success: boolean; data: any; message?: string }>(
        `/api/trading/estimate?coin_id=${coinId}&quantity=${quantity}&type=${type}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get order estimate');
    } catch (error) {
      console.error('Error getting order estimate:', error);
      throw error;
    }
  }
}

export const tradingService = new TradingService();
export default tradingService; 