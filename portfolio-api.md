# Portfolio API Documentation

This document describes the Portfolio API endpoints for accessing user portfolio data in the Coins CLI application.

## Overview

The Portfolio API provides access to user portfolio information, including current holdings, profit/loss calculations, and portfolio performance metrics. All portfolio endpoints require authentication.

## Authentication

All portfolio endpoints require JWT authentication. Users must be logged in and include their JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

## Base URL

The API base URL is configurable but typically follows this pattern:
```
https://your-api-domain.com/api
```

## Portfolio Endpoints

### 1. Get User Portfolio

**Endpoint:** `GET /api/transactions/portfolio/:userId`

**Description:** Retrieves the complete portfolio data for a specific user, including all holdings, current values, and profit/loss calculations.

**Path Parameters:**
- `userId` (number, required): The ID of the user whose portfolio to retrieve

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response Format:**
```json
{
  "portfolio": [
    {
      "coin_id": 1,
      "name": "Bitcoin",
      "symbol": "BTC",
      "current_price": 45230.50,
      "total_amount": 0.5,
      "total_invested": 25000.00
    },
    {
      "coin_id": 2,
      "name": "Ethereum",
      "symbol": "ETH",
      "current_price": 3245.75,
      "total_amount": 2.0,
      "total_invested": 6646.00
    }
  ],
  "user_funds": 2450.00
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `portfolio` | Array | Array of portfolio holdings |
| `user_funds` | Number | Available funds in user's account |

**Portfolio Holding Object:**

| Field | Type | Description |
|-------|------|-------------|
| `coin_id` | Number | Unique identifier for the coin |
| `name` | String | Full name of the coin (e.g., "Bitcoin") |
| `symbol` | String | Coin symbol (e.g., "BTC") |
| `current_price` | Number | Current market price in GBP |
| `total_amount` | Number | Total quantity of coins held |
| `total_invested` | Number | Total amount invested in this coin |

**Status Codes:**
- `200`: Portfolio retrieved successfully
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (user can only access their own portfolio)
- `404`: User not found
- `500`: Internal server error

## Calculated Fields

The API returns raw data, but the following fields can be calculated client-side:

### Current Value
```javascript
const currentValue = holding.total_amount * holding.current_price;
```

### Profit/Loss (Absolute)
```javascript
const profitLoss = currentValue - holding.total_invested;
```

### Profit/Loss (Percentage)
```javascript
const profitLossPercent = (profitLoss / holding.total_invested) * 100;
```

### Portfolio Totals
```javascript
const totalPortfolioValue = portfolio.reduce((sum, holding) => 
  sum + (holding.total_amount * holding.current_price), 0
);

const totalInvested = portfolio.reduce((sum, holding) => 
  sum + holding.total_invested, 0
);

const totalProfitLoss = totalPortfolioValue - totalInvested;
const totalProfitLossPercent = (totalProfitLoss / totalInvested) * 100;
```

## Usage Examples

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

async function getPortfolio(userId, token) {
  try {
    const response = await axios.get(`/api/transactions/portfolio/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch portfolio:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
const portfolioData = await getPortfolio(123, 'your-jwt-token');
console.log('Portfolio:', portfolioData.portfolio);
console.log('Available funds:', portfolioData.user_funds);
```

### cURL Example

```bash
curl -X GET \
  "https://your-api-domain.com/api/transactions/portfolio/123" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

### Python Example

```python
import requests

def get_portfolio(user_id, token):
    url = f"https://your-api-domain.com/api/transactions/portfolio/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Usage
portfolio_data = get_portfolio(123, "your-jwt-token")
print("Portfolio:", portfolio_data["portfolio"])
print("Available funds:", portfolio_data["user_funds"])
```

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "You can only access your own portfolio"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Data Validation

### Portfolio Data Validation

- All monetary values are returned as numbers with up to 2 decimal places
- Coin IDs are positive integers
- Symbol and name fields are non-empty strings
- Total amounts and prices are positive numbers
- Total invested amounts are non-negative numbers

### Client-Side Validation

```javascript
function validatePortfolioData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid portfolio data format');
  }
  
  if (!Array.isArray(data.portfolio)) {
    throw new Error('Portfolio must be an array');
  }
  
  if (typeof data.user_funds !== 'number' || data.user_funds < 0) {
    throw new Error('Invalid user funds value');
  }
  
  data.portfolio.forEach((holding, index) => {
    if (!holding.coin_id || !holding.name || !holding.symbol) {
      throw new Error(`Invalid holding at index ${index}`);
    }
    
    if (holding.current_price <= 0 || holding.total_amount <= 0) {
      throw new Error(`Invalid price or amount for ${holding.symbol}`);
    }
  });
}
```

## Rate Limiting

The portfolio API may implement rate limiting to prevent abuse. Typical limits:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Security Considerations

1. **Authentication Required**: All portfolio endpoints require valid JWT tokens
2. **User Isolation**: Users can only access their own portfolio data
3. **Token Expiration**: JWT tokens expire after 24 hours
4. **HTTPS Required**: All API calls should use HTTPS in production
5. **Input Validation**: Always validate user IDs and other parameters

## Best Practices

1. **Error Handling**: Always implement proper error handling for network failures
2. **Caching**: Consider caching portfolio data for better performance
3. **Refresh Tokens**: Implement token refresh logic for long-running applications
4. **Data Validation**: Validate all received data before processing
5. **Logging**: Log API calls for debugging and monitoring purposes

## Related Endpoints

- **User Authentication**: `POST /api/users/login`
- **User Registration**: `POST /api/users/register`
- **Transaction History**: `GET /api/transactions/user/:userId`
- **Buy Transaction**: `POST /api/transactions/buy`
- **Sell Transaction**: `POST /api/transactions/sell`

## Versioning

The current API version is v1. Future versions will be available at `/api/v2/transactions/portfolio/:userId`.

## Support

For API support and questions:
- Check the main API documentation
- Review error responses for troubleshooting
- Contact the development team for technical issues 