# Transaction History API Documentation

This document provides a comprehensive explanation of how the transaction history endpoint works in the Coins CLI application, including API specifications, client implementation, and usage examples.

## Overview

The transaction history functionality allows users to view, filter, and export their trading transaction history. The system consists of:

1. **Backend API Endpoint**: `GET /api/transactions/user/:userId`
2. **Client Implementation**: CLI commands and API service methods
3. **Display Layer**: Formatted tables and export functionality

## API Endpoint Specification

### Get User Transactions

**Endpoint:** `GET /api/transactions/user/:userId`

**Description:** Retrieves transaction history for a specific user with optional pagination.

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `userId` (number, required): The ID of the user whose transactions to retrieve

**Query Parameters:**
- `limit` (number, optional): Number of transactions to return (default: 10, max: 100)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response Format:**
```json
{
  "transactions": [
    {
      "transaction_id": "TX123456789",
      "user_id": 1,
      "coin_id": 1,
      "coin_name": "Bitcoin",
      "symbol": "BTC",
      "type": "BUY",
      "quantity": 0.5,
      "price": 45230.50,
      "total_amount": 22615.25,
      "created_at": "2024-01-15T14:30:25.000Z",
      "status": "completed"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `transactions` | Array | Array of transaction objects |
| `transaction_id` | String | Unique transaction identifier |
| `user_id` | Number | ID of the user who made the transaction |
| `coin_id` | Number | ID of the coin being traded |
| `coin_name` | String | Full name of the coin (e.g., "Bitcoin") |
| `symbol` | String | Coin symbol (e.g., "BTC") |
| `type` | String | Transaction type: "BUY" or "SELL" |
| `quantity` | Number | Amount of coins traded |
| `price` | Number | Price per coin at time of transaction |
| `total_amount` | Number | Total value of the transaction |
| `created_at` | String | ISO timestamp of when transaction occurred |
| `status` | String | Transaction status (optional) |

## Client Implementation

### API Service Layer

The transaction history functionality is implemented in the API service layer (`cli/src/services/api.js`):

```javascript
// API methods for transactions
const api = {
  // Get user transactions with optional limit
  getUserTransactions: (userId, limit = 10) => 
    authenticatedApiClient.get(`/api/transactions/user/${userId}?limit=${limit}`),
  
  // Get specific transaction details
  getTransaction: (transactionId) => 
    authenticatedApiClient.get(`/api/transactions/${transactionId}`)
};
```

**Key Features:**
- Uses authenticated API client with JWT token
- Supports pagination via `limit` parameter
- Automatic error handling and response formatting

### Command Implementation

The transaction history commands are implemented in `cli/src/commands/transactions.js`:

#### History Command

```javascript
async history(options = {}) {
  const user = authMiddleware.requireAuth();
  const limit = options.limit || 10;
  const type = options.type; // 'BUY' or 'SELL'

  display.header('Transaction History');
  
  try {
    const spinner = display.spinner('Fetching transaction history...');
    const response = await api.getUserTransactions(user.userId, limit);
    spinner.succeed('Transaction history loaded');
    
    let transactions = response.data.transactions;
    
    // Filter by type if specified
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    if (transactions.length === 0) {
      display.info('No transactions found');
      return;
    }

    const table = display.createTransactionTable();
    
    transactions.forEach(transaction => {
      const typeColor = transaction.type === 'BUY' ? 
        chalk.green : chalk.red;
      
      table.push([
        transaction.transaction_id,
        typeColor(transaction.type),
        transaction.symbol,
        transaction.quantity,
        display.formatCurrency(transaction.price),
        display.formatCurrency(transaction.total_amount),
        new Date(transaction.created_at).toLocaleString()
      ]);
    });
    
    console.log(table.toString());
    display.info(`Showing ${transactions.length} transactions`);
    
  } catch (error) {
    display.error('Failed to fetch transaction history');
    if (process.argv.includes('--debug')) {
      console.error(error);
    }
  }
}
```

**Features:**
- Authentication requirement check
- Loading spinner for user feedback
- Client-side filtering by transaction type
- Formatted table display with color coding
- Error handling with debug mode support

#### Details Command

```javascript
async details(transactionId) {
  if (!transactionId) {
    display.error('Transaction ID is required');
    display.info('Usage: coins-cli transactions details <transaction-id>');
    return;
  }

  display.header(`Transaction Details (${transactionId})`);
  
  try {
    const spinner = display.spinner('Fetching transaction details...');
    const response = await api.getTransaction(transactionId);
    spinner.succeed('Transaction details loaded');
    
    const transaction = response.data;
    
    console.log(display.colors.bold('Transaction Information:'));
    console.log(`  ID: ${transaction.transaction_id}`);
    console.log(`  Type: ${transaction.type}`);
    console.log(`  User ID: ${transaction.user_id}`);
    console.log(`  Coin ID: ${transaction.coin_id}`);
    console.log(`  Coin Name: ${transaction.coin_name}`);
    console.log(`  Coin Symbol: ${transaction.symbol}`);
    console.log(`  Quantity: ${transaction.quantity}`);
    console.log(`  Price per Coin: ${display.formatCurrency(transaction.price)}`);
    console.log(`  Total Amount: ${display.formatCurrency(transaction.total_amount)}`);
    console.log(`  Timestamp: ${new Date(transaction.created_at).toLocaleString()}`);
    
    if (transaction.status) {
      console.log(`  Status: ${transaction.status}`);
    }
    
  } catch (error) {
    display.error(`Failed to fetch transaction details for ${transactionId}`);
    if (process.argv.includes('--debug')) {
      console.error(error);
    }
  }
}
```

#### Export Command

```javascript
async export(options = {}) {
  const user = authMiddleware.requireAuth();
  const format = options.format || 'json';
  const filename = options.filename || `transactions-${new Date().toISOString().split('T')[0]}`;
  const limit = options.limit || 100;

  display.header('Transaction History Export');
  
  try {
    const spinner = display.spinner('Fetching transaction history...');
    const response = await api.getUserTransactions(user.userId, limit);
    spinner.succeed('Transaction history loaded');
    
    const transactions = response.data.transactions;
    
    if (format === 'csv') {
      // CSV export
      const csvContent = [
        'Transaction ID,Type,Coin Name,Coin Symbol,Quantity,Price per Coin,Total Amount,Timestamp',
        ...transactions.map(t => 
          `${t.transaction_id},${t.type},${t.coin_name},${t.symbol},${t.quantity},${t.price},${t.total_amount},${new Date(t.created_at).toISOString()}`
        )
      ].join('\n');
      
      const fs = require('fs');
      fs.writeFileSync(`${filename}.csv`, csvContent);
      display.success(`Transaction history exported to ${filename}.csv`);
      
    } else {
      // JSON export
      const fs = require('fs');
      fs.writeFileSync(`${filename}.json`, JSON.stringify(transactions, null, 2));
      display.success(`Transaction history exported to ${filename}.json`);
    }
    
  } catch (error) {
    display.error('Failed to export transaction history');
    if (process.argv.includes('--debug')) {
      console.error(error);
    }
  }
}
```

## Display Layer

### Transaction Table Format

The display utility (`cli/src/utils/display.js`) provides formatted table creation:

```javascript
createTransactionTable: () => {
  return new Table({
    head: [
      colors.bold('ID'),
      colors.bold('Type'),
      colors.bold('Coin'),
      colors.bold('Quantity'),
      colors.bold('Price'),
      colors.bold('Total'),
      colors.bold('Date')
    ],
    colWidths: [8, 8, 12, 12, 12, 15, 20]
  });
}
```

**Table Features:**
- Color-coded transaction types (green for BUY, red for SELL)
- Formatted currency values
- Localized date/time display
- Consistent column widths for readability

### Currency Formatting

```javascript
formatCurrency: (amount, currency = 'GBP') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency
  }).format(amount);
}
```

## CLI Command Interface

### Command Structure

The CLI commands are defined in `cli/bin/coins-cli.js`:

```javascript
const transactions = program
  .command('transactions')
  .description('Transaction history and management');

transactions
  .command('history')
  .description('View transaction history')
  .option('-l, --limit <number>', 'Number of transactions to show', '10')
  .option('-t, --type <type>', 'Filter by transaction type (BUY, SELL)')
  .action(async (options) => {
    await transactionCommands.history(options);
  });

transactions
  .command('details <transaction-id>')
  .description('Show detailed transaction information')
  .action(async (transactionId) => {
    await transactionCommands.details(transactionId);
  });

transactions
  .command('export')
  .description('Export transaction history')
  .option('-f, --format <format>', 'Export format (json, csv)', 'json')
  .option('-l, --limit <number>', 'Number of transactions to export', '100')
  .option('-o, --filename <name>', 'Output filename (without extension)')
  .action(async (options) => {
    await transactionCommands.export(options);
  });
```

## Usage Examples

### Basic Transaction History

```bash
# View last 10 transactions
coins-cli transactions history

# View last 20 transactions
coins-cli transactions history --limit 20

# View only buy transactions
coins-cli transactions history --type BUY

# View only sell transactions
coins-cli transactions history --type SELL
```

### Transaction Details

```bash
# View specific transaction details
coins-cli transactions details TX123456789
```

### Export Functionality

```bash
# Export last 100 transactions as JSON
coins-cli transactions export

# Export last 50 transactions as CSV
coins-cli transactions export --format csv --limit 50

# Export with custom filename
coins-cli transactions export --filename my-transactions --format csv
```

### Interactive Mode

```bash
# Use interactive menu for transaction history
coins-cli interactive
# Then navigate to "Transaction History Options"
```

## Error Handling

### API Error Responses

The system handles various error scenarios:

```javascript
catch (error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      display.error('Invalid transaction request');
    } else if (status === 401) {
      display.error('Unauthorized - please login again');
    } else if (status === 404) {
      display.error('Transaction not found');
    } else {
      display.error(`Transaction failed (HTTP ${status})`);
    }
    
    if (data && data.message) {
      display.info(`Server message: ${data.message}`);
    }
  } else {
    display.error('Transaction failed');
  }
  
  if (process.argv.includes('--debug')) {
    console.error(error);
  }
}
```

### Common Error Scenarios

1. **Authentication Errors (401)**
   - User not logged in
   - Expired JWT token
   - Invalid token format

2. **Authorization Errors (403)**
   - User trying to access another user's transactions
   - Insufficient permissions

3. **Not Found Errors (404)**
   - Transaction ID doesn't exist
   - User ID doesn't exist

4. **Validation Errors (400)**
   - Invalid limit parameter
   - Invalid transaction type filter

## Security Considerations

### Authentication Requirements

- All transaction history endpoints require valid JWT authentication
- Tokens expire after 24 hours
- Users can only access their own transaction data

### Data Validation

- Input validation for user IDs and transaction IDs
- Limit parameter validation (max 100 transactions)
- Transaction type validation (BUY/SELL only)

### Error Information

- Limited error details in production
- Debug mode available for development
- No sensitive data exposed in error messages

## Performance Considerations

### Pagination

- Default limit of 10 transactions per request
- Maximum limit of 100 transactions
- Client-side filtering for transaction types

### Caching

- No built-in caching (each request fetches fresh data)
- Consider implementing caching for frequently accessed data

### Rate Limiting

- API may implement rate limiting
- Respect rate limit headers in responses

## Testing

### Unit Tests

The API service includes comprehensive tests (`cli/tests/services/api.test.js`):

```javascript
test('getUserTransactions should make GET request with limit', async () => {
  const userId = 1;
  const limit = 5;
  
  const mockResponse = [
    {
      transaction_id: 1,
      user_id: 1,
      coin_id: 1,
      type: 'BUY',
      quantity: 0.5,
      price: 50000,
      total_amount: 25000,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  nock(baseUrl)
    .get(`/api/transactions/user/${userId}?limit=${limit}`)
    .reply(200, mockResponse);

  const response = await api.getUserTransactions(userId, limit);
  
  expect(response.data).toEqual(mockResponse);
  expect(response.status).toBe(200);
});
```

## Integration Points

### Related Endpoints

- **Buy Transaction**: `POST /api/transactions/buy`
- **Sell Transaction**: `POST /api/transactions/sell`
- **Portfolio**: `GET /api/transactions/portfolio/:userId`
- **User Authentication**: `POST /api/users/login`

### Data Flow

1. User executes transaction history command
2. CLI validates authentication and parameters
3. API service makes authenticated request to backend
4. Backend validates user permissions and returns data
5. CLI formats and displays results
6. Optional export functionality saves data to file

## Future Enhancements

### Potential Improvements

1. **Advanced Filtering**
   - Date range filtering
   - Amount range filtering
   - Multiple coin filtering

2. **Enhanced Export**
   - PDF export format
   - Email export functionality
   - Scheduled exports

3. **Analytics**
   - Transaction statistics
   - Performance metrics
   - Trend analysis

4. **Real-time Updates**
   - WebSocket integration
   - Live transaction notifications
   - Auto-refresh functionality

## Conclusion

The transaction history endpoint provides a comprehensive solution for viewing and managing user transaction data. The implementation includes proper authentication, error handling, data formatting, and export capabilities. The modular design allows for easy extension and maintenance of the functionality. 