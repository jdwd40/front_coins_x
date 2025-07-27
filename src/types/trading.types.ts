// Trading Types
export interface Transaction {
  id: string;
  user_id: string;
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BuyOrderRequest {
  coin_id: string;
  quantity: number;
  amount: number;
}

export interface SellOrderRequest {
  coin_id: string;
  quantity: number;
}

export interface OrderConfirmation {
  order_id: string;
  coin_name: string;
  coin_symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  fee: number;
  estimated_total: number;
}

export interface Portfolio {
  total_value: number;
  total_profit_loss: number;
  total_profit_loss_percentage: number;
  total_invested: number;
  holdings: Holding[];
  last_updated: string;
}

export interface Holding {
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  total_invested: number;
  last_transaction_date: string;
}

export interface TradingPair {
  base_coin: string;
  quote_coin: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  volume_24h: number;
  high_24h: number;
  low_24h: number;
}

export interface TradingStats {
  total_trades: number;
  successful_trades: number;
  total_volume: number;
  average_trade_size: number;
  win_rate: number;
  total_fees_paid: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  last_updated: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface TradeHistory {
  trades: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface Trade {
  id: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

// API Response Types for Trading
export interface TransactionResponse {
  success: boolean;
  data: Transaction;
  message?: string;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrderListResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

export interface PortfolioResponse {
  success: boolean;
  data: Portfolio;
  message?: string;
}

export interface OrderBookResponse {
  success: boolean;
  data: OrderBook;
  message?: string;
}

export interface TradeHistoryResponse {
  success: boolean;
  data: TradeHistory;
  message?: string;
}

export interface TradingStatsResponse {
  success: boolean;
  data: TradingStats;
  message?: string;
} 