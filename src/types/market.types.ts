// Market Types
export interface Coin {
  coin_id: number;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  market_cap: number;
  circulating_supply: number;
  founder: string;
}

export interface MarketStatus {
  cycle: 'STRONG_BOOM' | 'MILD_BOOM' | 'STABLE' | 'MILD_BUST' | 'STRONG_BUST';
  last_updated: string;
  trend_direction: 'up' | 'down' | 'stable';
  market_sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility_index: number;
}

export interface PriceHistory {
  timestamp: string;
  price: number;
  volume?: number;
  market_cap?: number;
}

export interface MarketData {
  coins: Coin[];
  market_status: MarketStatus;
  total_market_cap: number;
  total_volume_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
}

export interface CoinPriceData {
  coin_id: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  volume_24h: number;
  market_cap: number;
  last_updated: string;
}

export interface MarketFilters {
  search?: string;
  sort_by?: 'name' | 'price' | 'market_cap' | 'price_change_24h' | 'volume_24h';
  sort_order?: 'asc' | 'desc';
  min_price?: number;
  max_price?: number;
  min_market_cap?: number;
  max_market_cap?: number;
}

export interface MarketStats {
  total_coins: number;
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_24h: number;
  volume_change_24h: number;
}

// API Response Types for Market Data
export interface MarketDataResponse {
  success: boolean;
  data: MarketData;
  message?: string;
}

export interface CoinListResponse {
  coins: Coin[];
}

export interface PriceHistoryResponse {
  success: boolean;
  data: PriceHistory[];
  message?: string;
}

export interface MarketStatusResponse {
  success: boolean;
  data: MarketStatus;
  message?: string;
} 