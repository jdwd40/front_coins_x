export interface PortfolioHolding {
  coin_id: number;
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

export interface Portfolio {
  total_value: number;
  total_profit_loss: number;
  total_profit_loss_percentage: number;
  total_invested: number;
  holdings: PortfolioHolding[];
  last_updated: string;
}

export interface PortfolioResponse {
  status: 'success' | 'error';
  message: string;
  data?: Portfolio;
}

class PortfolioService {
  // Get user's portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      if (!user.user_id) {
        throw new Error('User ID not found');
      }

      console.log('Fetching portfolio for user:', user.user_id);
      
      const response = await fetch(`https://jdwd40.com/api-2/api/transactions/portfolio/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Portfolio API error:', data);
        throw new Error(data.message || data.msg || 'Failed to fetch portfolio');
      }

      console.log('Portfolio API response:', data);

      // Transform the API response to match our Portfolio interface
      // The API might return data directly, nested in 'data.portfolio', or wrapped in a response object
      let portfolioData;
      if (data.data && data.data.portfolio) {
        // Response wrapped in data object
        portfolioData = data.data.portfolio;
      } else if (data.portfolio) {
        // Direct portfolio array
        portfolioData = data.portfolio;
      } else if (Array.isArray(data)) {
        // Direct array response
        portfolioData = data;
      } else {
        // Fallback
        portfolioData = [];
      }
      
      console.log('Portfolio data to process:', portfolioData);
      
      const holdings: PortfolioHolding[] = portfolioData.map((holding: any) => {
        console.log('Processing holding from API:', holding);
        
        const totalAmount = Number(holding.total_amount);
        const currentPrice = Number(holding.current_price);
        const totalInvested = Number(holding.total_invested);
        
        const currentValue = totalAmount * currentPrice;
        const profitLoss = currentValue - totalInvested;
        const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
        const averageBuyPrice = totalAmount > 0 ? totalInvested / totalAmount : 0;

        const transformedHolding = {
          coin_id: Number(holding.coin_id),
          coin_name: holding.name,
          coin_symbol: holding.symbol,
          quantity: Number(holding.total_amount),
          average_buy_price: Number(averageBuyPrice),
          current_price: Number(holding.current_price),
          current_value: Number(currentValue),
          profit_loss: Number(profitLoss),
          profit_loss_percentage: Number(profitLossPercentage),
          total_invested: Number(holding.total_invested),
          last_transaction_date: new Date().toISOString(), // API doesn't provide this, using current date
        };
        
        console.log('Transformed holding:', transformedHolding);
        return transformedHolding;
      });

      const totalValue = holdings.reduce((sum, holding) => sum + holding.current_value, 0);
      const totalInvested = holdings.reduce((sum, holding) => sum + holding.total_invested, 0);
      const totalProfitLoss = totalValue - totalInvested;
      const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

      return {
        total_value: totalValue,
        total_profit_loss: totalProfitLoss,
        total_profit_loss_percentage: totalProfitLossPercentage,
        total_invested: totalInvested,
        holdings: holdings,
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  // Get user's coin holdings (simplified version for now)
  async getHoldings(): Promise<PortfolioHolding[]> {
    try {
      const portfolio = await this.getPortfolio();
      return portfolio.holdings || [];
    } catch (error) {
      console.error('Error fetching holdings:', error);
      throw error;
    }
  }

  // Get a specific coin holding
  async getCoinHolding(coinId: number): Promise<PortfolioHolding | null> {
    try {
      const holdings = await this.getHoldings();
      return holdings.find(holding => holding.coin_id === coinId) || null;
    } catch (error) {
      console.error('Error fetching coin holding:', error);
      throw error;
    }
  }

  // Get user's balance
  async getBalance(): Promise<{ available_balance: number; total_balance: number }> {
    try {
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      if (!user.user_id) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`https://jdwd40.com/api-2/api/transactions/portfolio/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Balance API error:', data);
        throw new Error(data.message || data.msg || 'Failed to fetch balance');
      }

      // Extract user_funds from various possible response structures
      let userFunds = 0;
      if (data.data && data.data.user_funds !== undefined) {
        userFunds = data.data.user_funds;
      } else if (data.user_funds !== undefined) {
        userFunds = data.user_funds;
      }

      // The portfolio API returns user_funds as the available balance
      return {
        available_balance: userFunds,
        total_balance: userFunds, // Using same value for total balance
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
}

export const portfolioService = new PortfolioService();
export default portfolioService; 