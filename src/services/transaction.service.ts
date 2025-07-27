

export interface BuyTransactionRequest {
  user_id: number;
  coin_id: number;
  amount: number;
}

export interface SellTransactionRequest {
  user_id: number;
  coin_id: number;
  amount: number;
}

export interface TransactionResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    transaction_id: number;
    user_id: number;
    coin_id: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    total_amount: number;
    created_at: string;
  };
  required_amount?: number;
  current_price?: number;
  available_amount?: number;
  requested_amount?: number;
}

class TransactionService {
  // Buy coins
  async buyCoins(request: BuyTransactionRequest): Promise<TransactionResponse> {
    try {
      const response = await fetch('https://jdwd40.com/api-2/api/transactions/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Buy transaction failed');
      }

      return data;
    } catch (error) {
      console.error('Error buying coins:', error);
      throw error;
    }
  }

  // Sell coins
  async sellCoins(request: SellTransactionRequest): Promise<TransactionResponse> {
    try {
      const response = await fetch('https://jdwd40.com/api-2/api/transactions/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Sell transaction failed');
      }

      return data;
    } catch (error) {
      console.error('Error selling coins:', error);
      throw error;
    }
  }


}

export const transactionService = new TransactionService();
export default transactionService; 