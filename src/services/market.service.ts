import apiService from './api';
import {
  Coin,
  MarketStatus,
  PriceHistory,
  MarketData,
  CoinListResponse,
  PriceHistoryResponse,
  MarketStatusResponse,
  MarketDataResponse,
  MarketFilters,
  MarketStats,
} from '@/types/market.types';

class MarketService {
  // Get all coins with optional filtering
  async getCoins(filters?: MarketFilters): Promise<Coin[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.sort_by) {
        params.append('sort_by', filters.sort_by);
      }
      if (filters?.sort_order) {
        params.append('sort_order', filters.sort_order);
      }
      if (filters?.min_price) {
        params.append('min_price', filters.min_price.toString());
      }
      if (filters?.max_price) {
        params.append('max_price', filters.max_price.toString());
      }
      if (filters?.min_market_cap) {
        params.append('min_market_cap', filters.min_market_cap.toString());
      }
      if (filters?.max_market_cap) {
        params.append('max_market_cap', filters.max_market_cap.toString());
      }

      const response = await apiService.get<CoinListResponse>(`/api/coins${params.toString() ? `?${params.toString()}` : ''}`);
      
      return response.coins;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  }

  // Get a specific coin by ID
  async getCoin(coinId: string): Promise<Coin> {
    try {
      const response = await apiService.get<{ success: boolean; data: Coin; message?: string }>(`/api/coins/${coinId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch coin');
    } catch (error) {
      console.error('Error fetching coin:', error);
      throw error;
    }
  }

  // Get market status and cycle information
  async getMarketStatus(): Promise<MarketStatus> {
    try {
      const response = await apiService.get<MarketStatusResponse>('/api/market/status');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch market status');
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw error;
    }
  }

  // Get price history for a specific coin
  async getPriceHistory(
    coinId: string,
    timeRange: '1h' | '24h' | '7d' | '30d' | '1y' = '24h'
  ): Promise<PriceHistory[]> {
    try {
      const response = await apiService.get<PriceHistoryResponse>(
        `/api/coins/${coinId}/price-history?range=${timeRange}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch price history');
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  // Get comprehensive market data
  async getMarketData(): Promise<MarketData> {
    try {
      const response = await apiService.get<MarketDataResponse>('/api/market/data');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch market data');
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  // Get market statistics
  async getMarketStats(): Promise<MarketStats> {
    try {
      const response = await apiService.get<{ success: boolean; data: MarketStats; message?: string }>('/api/market/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch market stats');
    } catch (error) {
      console.error('Error fetching market stats:', error);
      throw error;
    }
  }

  // Get trending coins
  async getTrendingCoins(): Promise<Coin[]> {
    try {
      const response = await apiService.get<CoinListResponse>('/api/market/trending');
      return response.coins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  }

  // Get top gainers
  async getTopGainers(): Promise<Coin[]> {
    try {
      const response = await apiService.get<CoinListResponse>('/api/market/top-gainers');
      return response.coins;
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      throw error;
    }
  }

  // Get top losers
  async getTopLosers(): Promise<Coin[]> {
    try {
      const response = await apiService.get<CoinListResponse>('/api/market/top-losers');
      return response.coins;
    } catch (error) {
      console.error('Error fetching top losers:', error);
      throw error;
    }
  }

  // Search coins by name or symbol
  async searchCoins(query: string): Promise<Coin[]> {
    try {
      const response = await apiService.get<CoinListResponse>(`/api/coins/search?q=${encodeURIComponent(query)}`);
      return response.coins;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  }

  // Get real-time price updates (for WebSocket fallback)
  async getRealTimePrices(coinIds: string[]): Promise<Record<string, number>> {
    try {
      const response = await apiService.get<{ success: boolean; data: Record<string, number>; message?: string }>(
        `/api/market/prices?coins=${coinIds.join(',')}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch real-time prices');
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
      throw error;
    }
  }
}

export const marketService = new MarketService();
export default marketService; 