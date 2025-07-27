# Simple Cryptocurrency Trading Platform - Cursor Agent Mode Development Plan

## Overview

This document breaks down a **simple** cryptocurrency trading platform frontend development into manageable phases optimized for Cursor's agent mode. Focus is on essential features only.

## API Base URL
**Base URL**: `https://jdwd40.com/api-2`

## Technology Stack (Simplified)

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling (no Headless UI)
- **React Query** for API calls
- **React Router v6** for routing
- **React Hook Form** + **Zod** for forms
- **Recharts** for basic charts
- **Socket.io-client** for real-time updates

## Phase 1: Basic Setup (2 Sessions)

### Session 1: Project Setup
**Duration**: 1 hour  
**Objective**: Create basic project with essential setup

#### Requirements:
- Create Vite + React + TypeScript project
- Install Tailwind CSS
- Setup basic folder structure
- Create simple layout

#### Files to Create:
```
src/
├── components/
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Trading.tsx
│   ├── Portfolio.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── App.tsx
├── main.tsx
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

#### Dependencies to Install:
```bash
npm install react-router-dom @tanstack/react-query react-hook-form zod recharts socket.io-client
npm install -D tailwindcss
```

#### Example Prompt:
```
"Help me create a simple React TypeScript project for a cryptocurrency trading platform.

Requirements:
- Create Vite + React + TypeScript project
- Install and setup Tailwind CSS
- Create basic layout with header and sidebar
- Setup React Router with simple routes
- Create placeholder pages

Files to create:
- src/components/Layout.tsx
- src/components/Header.tsx
- src/components/Sidebar.tsx
- src/pages/Dashboard.tsx, Trading.tsx, Portfolio.tsx, Login.tsx, Register.tsx
- src/App.tsx
- tailwind.config.js

Keep it simple - just basic navigation and layout."
```

---

### Session 2: Authentication
**Duration**: 1 hour  
**Objective**: Basic login/register functionality

#### Requirements:
- Simple login form
- Simple register form
- Basic auth context
- Protected routes

#### Files to Create:
```
src/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── context/
│   └── AuthContext.tsx
├── services/
│   └── auth.ts
└── types/
    └── auth.ts
```

#### API Endpoints:
- **Register**: `POST https://jdwd40.com/api-2/api/users/register`
- **Login**: `POST https://jdwd40.com/api-2/api/users/login`

#### Example Prompt:
```
"Help me create simple authentication for my trading platform.

Requirements:
- Create basic login form with email/password
- Create basic register form with username/email/password
- Setup simple auth context
- Add protected routes
- Use React Hook Form + Zod for validation
- Connect to API endpoints:
  - POST https://jdwd40.com/api-2/api/users/register
  - POST https://jdwd40.com/api-2/api/users/login

Files to create:
- src/components/LoginForm.tsx
- src/components/RegisterForm.tsx
- src/context/AuthContext.tsx
- src/services/auth.ts
- src/types/auth.ts

Keep it simple - just basic auth functionality."
```

---

## Phase 2: Market Data (2 Sessions)

### Session 3: Market Display
**Duration**: 1 hour  
**Objective**: Show coin list and prices

#### Requirements:
- Display list of coins
- Show current prices
- Basic sorting
- Simple search

#### Files to Create:
```
src/
├── components/
│   ├── CoinList.tsx
│   └── CoinCard.tsx
├── services/
│   └── market.ts
└── types/
    └── market.ts
```

#### API Endpoints:
- **Get All Coins**: `GET https://jdwd40.com/api-2/coins`
- **Get Coin by ID**: `GET https://jdwd40.com/api-2/coins/:coin_id`

#### Example Prompt:
```
"Help me create a simple market display for my trading platform.

Requirements:
- Display list of coins with prices from GET https://jdwd40.com/api-2/coins
- Show price changes (green/red)
- Basic sorting by price/market cap
- Simple search by coin name
- Use Tailwind for styling
- Handle coin data structure with coin_id, name, symbol, current_price, market_cap, circulating_supply, price_change_24h, founder

Files to create:
- src/components/CoinList.tsx
- src/components/CoinCard.tsx
- src/services/market.ts
- src/types/market.ts

Keep it simple - just a basic table/list of coins."
```

---

### Session 4: Real-time Updates
**Duration**: 1 hour  
**Objective**: Add live price updates

#### Requirements:
- WebSocket connection
- Real-time price updates
- Simple connection status

#### Files to Create:
```
src/
├── services/
│   └── websocket.ts
├── hooks/
│   └── useWebSocket.ts
└── components/
    └── ConnectionStatus.tsx
```

#### API Endpoints:
- **Update Coin Price**: `PATCH https://jdwd40.com/api-2/coins/:coin_id`

#### Example Prompt:
```
"Help me add real-time price updates to my trading platform.

Requirements:
- Setup Socket.io client for real-time updates
- Connect to WebSocket for price updates
- Update coin prices in real-time
- Show simple connection status
- Add basic price change animations
- Use PATCH https://jdwd40.com/api-2/coins/:coin_id for price updates

Files to create:
- src/services/websocket.ts
- src/hooks/useWebSocket.ts
- src/components/ConnectionStatus.tsx

Keep it simple - just basic real-time updates."
```

---

## Phase 3: Trading (2 Sessions)

### Session 5: Trading Forms
**Duration**: 1 hour  
**Objective**: Basic buy/sell functionality

#### Requirements:
- Simple buy form
- Simple sell form
- Basic validation
- Order preview

#### Files to Create:
```
src/
├── components/
│   ├── BuyForm.tsx
│   ├── SellForm.tsx
│   └── OrderPreview.tsx
├── services/
│   └── trading.ts
└── types/
    └── trading.ts
```

#### API Endpoints:
- **Buy Transaction**: `POST https://jdwd40.com/api-2/transactions/buy`
- **Sell Transaction**: `POST https://jdwd40.com/api-2/transactions/sell`

#### Example Prompt:
```
"Help me create simple trading forms for my platform.

Requirements:
- Create buy form with quantity input
- Create sell form with quantity input
- Add basic validation
- Show order preview
- Use React Hook Form + Zod
- Connect to trading API endpoints:
  - POST https://jdwd40.com/api-2/transactions/buy
  - POST https://jdwd40.com/api-2/transactions/sell

Files to create:
- src/components/BuyForm.tsx
- src/components/SellForm.tsx
- src/components/OrderPreview.tsx
- src/services/trading.ts
- src/types/trading.ts

Keep it simple - just basic buy/sell forms."
```

---

### Session 6: Portfolio
**Duration**: 1 hour  
**Objective**: Show user holdings

#### Requirements:
- Display user holdings
- Show profit/loss
- Basic portfolio value

#### Files to Create:
```
src/
├── components/
│   ├── Portfolio.tsx
│   └── HoldingsList.tsx
├── services/
│   └── portfolio.ts
└── types/
    └── portfolio.ts
```

#### API Endpoints:
- **Get User Portfolio**: `GET https://jdwd40.com/api-2/transactions/portfolio/:user_id`
- **Get User Transactions**: `GET https://jdwd40.com/api-2/transactions/user/:user_id`

#### Example Prompt:
```
"Help me create a simple portfolio display.

Requirements:
- Show user's coin holdings from GET https://jdwd40.com/api-2/transactions/portfolio/:user_id
- Display current values
- Calculate profit/loss
- Show total portfolio value
- Use simple styling with Tailwind
- Handle user funds from auth context

Files to create:
- src/components/Portfolio.tsx
- src/components/HoldingsList.tsx
- src/services/portfolio.ts
- src/types/portfolio.ts

Keep it simple - just basic portfolio info."
```

---

## Phase 4: Charts & Analytics (1 Session)

### Session 7: Basic Charts
**Duration**: 1 hour  
**Objective**: Add simple price charts

#### Requirements:
- Basic price chart
- Simple time range selector
- Chart tooltips

#### Files to Create:
```
src/
├── components/
│   ├── PriceChart.tsx
│   └── ChartControls.tsx
├── hooks/
│   └── useChartData.ts
└── types/
    └── charts.ts
```

#### API Endpoints:
- **Get Coin Price History**: `GET https://jdwd40.com/api-2/coins/:coin_id/history`
- **Get Market Price History**: `GET https://jdwd40.com/api-2/api/market/price-history`

#### Example Prompt:
```
"Help me add simple price charts to my trading platform.

Requirements:
- Create basic line chart using Recharts
- Add simple time range selector (1H, 24H, 7D)
- Show price history data from GET https://jdwd40.com/api-2/coins/:coin_id/history
- Add basic tooltips
- Keep it responsive
- Handle pagination with page and limit parameters

Files to create:
- src/components/PriceChart.tsx
- src/components/ChartControls.tsx
- src/hooks/useChartData.ts
- src/types/charts.ts

Keep it simple - just basic price charts."
```

---

## Phase 5: Error Handling & Polish (2 Sessions)

### Session 8: Error Handling
**Duration**: 1 hour  
**Objective**: Add basic error handling

#### Requirements:
- Error boundary
- Loading states
- Error messages
- Basic validation

#### Files to Create:
```
src/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── hooks/
│   └── useError.ts
└── utils/
    └── errorHandling.ts
```

#### Example Prompt:
```
"Help me add basic error handling to my trading platform.

Requirements:
- Create error boundary component
- Add loading states for API calls
- Show error messages to users
- Add basic form validation
- Handle network errors gracefully
- Handle API error codes: 400, 401, 404, 409, 500

Files to create:
- src/components/ErrorBoundary.tsx
- src/components/LoadingSpinner.tsx
- src/components/ErrorMessage.tsx
- src/hooks/useError.ts
- src/utils/errorHandling.ts

Keep it simple - just basic error handling."
```

---

### Session 9: Final Polish
**Duration**: 1 hour  
**Objective**: Basic improvements and testing

#### Requirements:
- Fix any bugs
- Add responsive design
- Test all features
- Simple optimizations

#### Files to Create:
```
src/
├── utils/
│   ├── helpers.ts
│   └── formatters.ts
└── styles/
    └── responsive.css
```

#### Example Prompt:
```
"Help me polish my simple trading platform.

Requirements:
- Fix any responsive design issues
- Add basic utility functions
- Test all features work together
- Add simple loading states
- Ensure mobile compatibility
- Format currency values properly (2 decimal places)

Files to create:
- src/utils/helpers.ts
- src/utils/formatters.ts
- src/styles/responsive.css

Keep it simple - just basic polish and testing."
```

---

## Phase 6: Testing & Deployment (2 Sessions)

### Session 10: Basic Testing
**Duration**: 1 hour  
**Objective**: Add simple testing

#### Requirements:
- Basic unit tests
- Component testing
- Manual testing checklist

#### Files to Create:
```
src/
└── __tests__/
    ├── components/
    ├── hooks/
    └── utils/
```

#### Example Prompt:
```
"Help me add basic testing to my trading platform.

Requirements:
- Setup Jest and React Testing Library
- Write basic unit tests for components
- Test authentication flow
- Test trading functionality
- Create manual testing checklist
- Test API integration

Files to create:
- src/__tests__/components/
- src/__tests__/hooks/
- src/__tests__/utils/
- jest.config.js

Keep it simple - just basic testing."
```

---

### Session 11: Deployment
**Duration**: 1 hour  
**Objective**: Deploy the application

#### Requirements:
- Build optimization
- Environment setup
- Basic deployment

#### Files to Create:
```
├── .env.production
├── vite.config.ts (updated)
└── README.md
```

#### Example Prompt:
```
"Help me deploy my simple trading platform.

Requirements:
- Optimize build for production
- Setup environment variables for API base URL
- Create deployment configuration
- Add basic documentation
- Test production build
- Configure API base URL: https://jdwd40.com/api-2

Files to create:
- .env.production
- vite.config.ts (updated for production)
- README.md

Keep it simple - just basic deployment."
```

---

## API Configuration

### Environment Variables (.env)
```bash
VITE_API_BASE_URL=https://jdwd40.com/api-2
VITE_WS_URL=wss://jdwd40.com/ws
```

### API Service Configuration (src/services/api.ts)
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jdwd40.com/api-2';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Complete TypeScript Interfaces

### API Types (src/types/api.ts)
```typescript
// User Types
export interface User {
  user_id: number;
  username: string;
  email: string;
  funds: number;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  msg: string;
  user: User;
  token: string;
}

// Coin Types
export interface Coin {
  coin_id: number;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  circulating_supply: number;
  price_change_24h: number;
  founder: string;
}

export interface PriceHistory {
  price: number;
  timestamp: string;
  price_change_percentage: number;
}

export interface PriceHistoryResponse {
  history: PriceHistory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Market Types
export interface MarketHistory {
  total_value: string;
  market_trend: string;
  created_at: string;
  timestamp: number;
}

export interface MarketHistoryResponse {
  history: MarketHistory[];
  timeRange: string;
  count: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  user_id: number;
  coin_id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  created_at: string;
}

export interface Portfolio {
  total_value: number;
  total_profit_loss: number;
  total_profit_loss_percentage: number;
  holdings: Holding[];
}

export interface Holding {
  coin_id: number;
  coin_name: string;
  coin_symbol: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
}
```

## Simple Configuration Files

### Tailwind Config (tailwind.config.js)
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'profit': '#10B981',
        'loss': '#EF4444',
      }
    }
  },
  plugins: []
}
```

### Vite Config (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
  }
})
```

## Complete Session Overview

### **Phase 1: Basic Setup (2 Sessions)**
- **Session 1**: Project Setup - Create project and basic layout
- **Session 2**: Authentication - Login/register functionality

### **Phase 2: Market Data (2 Sessions)**
- **Session 3**: Market Display - Show coin list and prices
- **Session 4**: Real-time Updates - WebSocket for live prices

### **Phase 3: Trading (2 Sessions)**
- **Session 5**: Trading Forms - Buy/sell forms
- **Session 6**: Portfolio - User holdings display

### **Phase 4: Charts & Analytics (1 Session)**
- **Session 7**: Basic Charts - Simple price charts

### **Phase 5: Error Handling & Polish (2 Sessions)**
- **Session 8**: Error Handling - Basic error management
- **Session 9**: Final Polish - Responsive design and testing

### **Phase 6: Testing & Deployment (2 Sessions)**
- **Session 10**: Basic Testing - Unit tests and manual testing
- **Session 11**: Deployment - Production build and deployment

## API Endpoints Summary

### **Authentication**
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### **Market Data**
- `GET /coins` - Get all coins
- `GET /coins/:coin_id` - Get specific coin
- `PATCH /coins/:coin_id` - Update coin price
- `GET /coins/:coin_id/history` - Get coin price history
- `GET /api/market/price-history` - Get market price history

### **Trading**
- `POST /transactions/buy` - Buy transaction
- `POST /transactions/sell` - Sell transaction
- `GET /transactions/portfolio/:user_id` - Get user portfolio
- `GET /transactions/user/:user_id` - Get user transactions

## What's Removed (Simplified):

### ❌ Removed Complex Features:
- **Advanced charts** (just basic price display)
- **Complex state management** (just React Query + Context)
- **Advanced filtering** (just basic search)
- **PWA features** (not needed for simple app)
- **Advanced security** (basic auth only)
- **Complex testing** (just basic testing)
- **Performance optimization** (basic optimization only)
- **Mobile-specific features** (just responsive design)
- **Advanced error handling** (basic error handling)
- **Complex deployment** (basic deployment)

### ✅ Kept Essential Features:
- **Basic authentication** (login/register)
- **Market data display** (coin list with prices)
- **Real-time updates** (WebSocket for prices)
- **Basic trading** (buy/sell forms)
- **Portfolio display** (holdings and P&L)
- **Simple charts** (basic price visualization)
- **Responsive design** (works on mobile/desktop)
- **Basic error handling** (user-friendly errors)
- **Simple testing** (basic test coverage)
- **Basic deployment** (production ready)

## Timeline: 11 Sessions (1-2 hours each)

**Total Time**: 11-22 hours (vs 23+ sessions in complex version)

## Success Criteria:

### **Simple App Should Have:**
- [ ] User can login/register
- [ ] User can view coin prices in real-time
- [ ] User can buy/sell coins
- [ ] User can view their portfolio
- [ ] User can view price charts
- [ ] App works on mobile and desktop
- [ ] Basic error handling works
- [ ] App can be deployed to production
- [ ] No major bugs or crashes

### **What Makes It Simple:**
1. **Minimal dependencies** - only essential packages
2. **Basic UI** - simple forms and tables
3. **Essential features only** - no advanced features
4. **Quick development** - 11 sessions vs 23
5. **Easy to understand** - straightforward code
6. **Easy to maintain** - simple structure
7. **Production ready** - can be deployed and used

This simplified approach focuses on getting a working trading platform quickly with just the essential features. You can always add more features later if needed!
