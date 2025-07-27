# Cryptocurrency Trading Platform - Cursor Agent Mode Development Plan

## Overview

This document breaks down the cryptocurrency trading platform frontend development into manageable phases optimized for Cursor's agent mode. Each phase consists of focused sessions with clear objectives, specific requirements, and acceptance criteria.

## Technology Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Headless UI** for styling
- **React Query (TanStack Query)** for server state
- **Zustand** for client state
- **React Hook Form** + **Zod** for forms
- **Recharts** for data visualization
- **Socket.io-client** for real-time updates
- **React Router v6** for routing

## Phase 1: Foundation Setup (2 Sessions)

### Session 1: Project Setup & Configuration
**Duration**: 1-2 hours  
**Objective**: Create the project foundation with all necessary configurations

#### Requirements:
- Create Vite + React + TypeScript project
- Install and configure Tailwind CSS with trading theme
- Setup ESLint, Prettier, and Git hooks
- Configure basic folder structure
- Create environment configuration

#### Files to Create:
```
src/
├── config/
│   └── environment.ts
├── styles/
│   ├── globals.css
│   ├── components.css
│   └── utilities.css
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.js
└── .prettierrc
```

#### Acceptance Criteria:
- [ ] Project runs without errors
- [ ] Tailwind CSS is working with custom theme
- [ ] ESLint and Prettier are configured
- [ ] Basic folder structure is in place
- [ ] Environment variables are configured

#### Dependencies to Install:
```bash
npm install @headlessui/react @tanstack/react-query react-hook-form zod recharts socket.io-client zustand react-router-dom
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

---

### Session 2: Basic Layout & Routing
**Duration**: 1-2 hours  
**Objective**: Create the basic application layout and routing structure

#### Requirements:
- Setup React Router with basic routes
- Create layout components (Header, Sidebar, Footer)
- Implement responsive design
- Add navigation structure
- Create placeholder pages

#### Files to Create:
```
src/
├── components/
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Trading.tsx
│   ├── Portfolio.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   └── Register.tsx
└── App.tsx
```

#### Acceptance Criteria:
- [ ] Navigation works between all routes
- [ ] Layout is responsive on mobile and desktop
- [ ] Header shows navigation menu
- [ ] Sidebar collapses on mobile
- [ ] All placeholder pages render correctly

---

## Phase 2: Authentication System (2 Sessions)

### Session 3: Authentication Context & Hooks
**Duration**: 1-2 hours  
**Objective**: Setup authentication state management and API services

#### Requirements:
- Create authentication context
- Setup JWT token management
- Create auth service for API calls
- Implement protected route wrapper
- Add token refresh logic

#### Files to Create:
```
src/
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── auth.service.ts
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx
└── types/
    └── auth.types.ts
```

#### Acceptance Criteria:
- [ ] Auth context manages user state
- [ ] JWT tokens are stored securely
- [ ] API service handles auth requests
- [ ] Protected routes redirect unauthenticated users
- [ ] Token refresh works automatically

---

### Session 4: Login & Registration Forms
**Duration**: 1-2 hours  
**Objective**: Build user authentication forms with validation

#### Requirements:
- Create login form with React Hook Form + Zod
- Create registration form with validation
- Implement form error handling
- Add loading states and success feedback
- Handle API responses and redirects

#### Files to Create:
```
src/
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── utils/
│   └── validators.ts
└── schemas/
    └── auth.schemas.ts
```

#### Acceptance Criteria:
- [ ] Forms validate input correctly
- [ ] Error messages display properly
- [ ] Loading states work during submission
- [ ] Success redirects to dashboard
- [ ] Form resets after successful submission

---

## Phase 3: API Integration & State Management (2 Sessions)

### Session 5: API Setup & React Query Configuration
**Duration**: 1-2 hours  
**Objective**: Setup API integration with React Query for data fetching

#### Requirements:
- Configure Axios with interceptors
- Setup React Query client
- Create base API service
- Implement error handling
- Add request/response logging

#### Files to Create:
```
src/
├── services/
│   ├── api.ts
│   ├── market.service.ts
│   └── trading.service.ts
├── hooks/
│   ├── useMarketData.ts
│   └── useTrading.ts
└── types/
    ├── market.types.ts
    └── trading.types.ts
```

#### Acceptance Criteria:
- [ ] API calls work with authentication
- [ ] React Query caches responses
- [ ] Error handling works properly
- [ ] Loading states are managed
- [ ] API base URL is configurable

---

### Session 6: Zustand State Management
**Duration**: 1-2 hours  
**Objective**: Setup client-side state management with Zustand

#### Requirements:
- Create auth store for user state
- Create market store for market data
- Create UI store for app state
- Implement optimistic updates
- Add persistence for important state

#### Files to Create:
```
src/
├── store/
│   ├── authStore.ts
│   ├── marketStore.ts
│   └── uiStore.ts
└── hooks/
    ├── useAuthStore.ts
    ├── useMarketStore.ts
    └── useUIStore.ts
```

#### Acceptance Criteria:
- [ ] Stores manage state correctly
- [ ] Optimistic updates work
- [ ] State persists across page reloads
- [ ] Stores are properly typed
- [ ] State updates trigger re-renders

---

## Phase 4: Market Dashboard (3 Sessions)

### Session 7: Market Data Display
**Duration**: 1-2 hours  
**Objective**: Create the market overview and coin listing components

#### Requirements:
- Display current market cycle
- Show coin listing with prices
- Implement sorting and filtering
- Add search functionality
- Create market status indicators

#### Files to Create:
```
src/
├── components/
│   ├── market/
│   │   ├── MarketOverview.tsx
│   │   ├── CoinList.tsx
│   │   ├── CoinCard.tsx
│   │   └── MarketStatus.tsx
│   └── ui/
│       ├── DataTable.tsx
│       ├── SearchInput.tsx
│       └── FilterDropdown.tsx
└── utils/
    └── formatters.ts
```

#### Acceptance Criteria:
- [ ] Market cycle displays correctly
- [ ] Coin list shows all required data
- [ ] Sorting works for all columns
- [ ] Search filters coins properly
- [ ] Market status updates in real-time

---

### Session 8: Price Charts Integration
**Duration**: 1-2 hours  
**Objective**: Integrate Recharts for price visualization

#### Requirements:
- Create price chart component
- Implement time range selectors
- Add chart interactions (zoom, pan)
- Display price history data
- Add chart tooltips and legends

#### Files to Create:
```
src/
├── components/
│   └── charts/
│       ├── PriceChart.tsx
│       ├── ChartControls.tsx
│       └── ChartTooltip.tsx
└── hooks/
    └── useChartData.ts
```

#### Acceptance Criteria:
- [ ] Charts render price data correctly
- [ ] Time range selectors work
- [ ] Chart interactions are smooth
- [ ] Tooltips show relevant information
- [ ] Charts are responsive

---

### Session 9: Real-time Price Updates
**Duration**: 1-2 hours  
**Objective**: Implement WebSocket integration for live data

#### Requirements:
- Setup Socket.io client connection
- Implement real-time price updates
- Add connection status indicators
- Handle connection failures gracefully
- Add price change animations

#### Files to Create:
```
src/
├── services/
│   └── websocket.service.ts
├── hooks/
│   └── useWebSocket.ts
├── components/
│   └── ui/
│       ├── ConnectionStatus.tsx
│       └── PriceIndicator.tsx
└── utils/
    └── websocket.ts
```

#### Acceptance Criteria:
- [ ] WebSocket connects automatically
- [ ] Price updates display in real-time
- [ ] Connection status is visible
- [ ] Reconnection works on failure
- [ ] Price changes are animated

---

## Phase 5: Trading Interface (3 Sessions)

### Session 10: Trading Forms
**Duration**: 1-2 hours  
**Objective**: Create buy and sell order forms

#### Requirements:
- Build buy order form with validation
- Build sell order form with validation
- Add order preview functionality
- Implement real-time calculations
- Add rate limiting for submissions

#### Files to Create:
```
src/
├── components/
│   └── trading/
│       ├── BuyForm.tsx
│       ├── SellForm.tsx
│       ├── OrderPreview.tsx
│       └── TradingCalculator.tsx
└── hooks/
    └── useTrading.ts
```

#### Acceptance Criteria:
- [ ] Forms validate input correctly
- [ ] Real-time calculations work
- [ ] Order preview shows accurate data
- [ ] Rate limiting prevents spam
- [ ] Forms handle errors gracefully

---

### Session 11: Transaction Processing
**Duration**: 1-2 hours  
**Objective**: Connect trading forms to API and handle transactions

#### Requirements:
- Connect forms to trading API
- Implement order confirmation flow
- Add success/error handling
- Create transaction history display
- Add optimistic updates

#### Files to Create:
```
src/
├── components/
│   └── trading/
│       ├── OrderConfirmation.tsx
│       ├── TransactionHistory.tsx
│       └── OrderStatus.tsx
├── services/
│   └── transaction.service.ts
└── hooks/
    └── useTransactions.ts
```

#### Acceptance Criteria:
- [ ] Orders are submitted successfully
- [ ] Confirmation flow works
- [ ] Transaction history displays correctly
- [ ] Optimistic updates work
- [ ] Error handling is user-friendly

---

### Session 12: Coin Detail Pages
**Duration**: 1-2 hours  
**Objective**: Create comprehensive coin detail pages

#### Requirements:
- Display detailed coin information
- Show price charts for specific coins
- Integrate trading forms
- Add coin metadata display
- Implement mobile optimization

#### Files to Create:
```
src/
├── components/
│   └── trading/
│       ├── CoinDetails.tsx
│       ├── CoinMetadata.tsx
│       └── CoinTrading.tsx
└── pages/
    └── CoinPage.tsx
```

#### Acceptance Criteria:
- [ ] Coin details display correctly
- [ ] Trading forms are integrated
- [ ] Charts show coin-specific data
- [ ] Mobile layout works well
- [ ] Navigation between coins works

---

## Phase 6: Portfolio Management (2 Sessions)

### Session 13: Portfolio Overview
**Duration**: 1-2 hours  
**Objective**: Create portfolio display and management

#### Requirements:
- Display user holdings
- Calculate portfolio metrics
- Show profit/loss indicators
- Add portfolio charts
- Implement real-time updates

#### Files to Create:
```
src/
├── components/
│   └── portfolio/
│       ├── PortfolioOverview.tsx
│       ├── HoldingsList.tsx
│       ├── PortfolioChart.tsx
│       └── PortfolioMetrics.tsx
└── hooks/
    └── usePortfolio.ts
```

#### Acceptance Criteria:
- [ ] Holdings display correctly
- [ ] Profit/loss calculations are accurate
- [ ] Portfolio charts render properly
- [ ] Real-time updates work
- [ ] Metrics are calculated correctly

---

### Session 14: Transaction History & Analytics
**Duration**: 1-2 hours  
**Objective**: Build transaction history and performance analytics

#### Requirements:
- Create transaction history display
- Add filtering and search
- Implement pagination
- Create performance analytics
- Add export functionality

#### Files to Create:
```
src/
├── components/
│   └── portfolio/
│       ├── TransactionHistory.tsx
│       ├── PerformanceAnalytics.tsx
│       └── ExportOptions.tsx
└── utils/
    └── analytics.ts
```

#### Acceptance Criteria:
- [ ] Transaction history displays correctly
- [ ] Filtering and search work
- [ ] Pagination handles large datasets
- [ ] Analytics calculations are accurate
- [ ] Export functionality works

---

## Phase 7: Mobile Optimization & PWA (2 Sessions)

### Session 15: Mobile Responsiveness
**Duration**: 1-2 hours  
**Objective**: Optimize the application for mobile devices

#### Requirements:
- Implement responsive design
- Add touch gestures
- Optimize charts for mobile
- Improve mobile navigation
- Add mobile-specific features

#### Files to Create:
```
src/
├── components/
│   └── mobile/
│       ├── MobileNavigation.tsx
│       ├── TouchGestures.tsx
│       └── MobileCharts.tsx
└── hooks/
    └── useMobile.ts
```

#### Acceptance Criteria:
- [ ] All pages work on mobile
- [ ] Touch gestures are implemented
- [ ] Charts are mobile-friendly
- [ ] Navigation is optimized
- [ ] Performance is good on mobile

---

### Session 16: PWA Features
**Duration**: 1-2 hours  
**Objective**: Add Progressive Web App features

#### Requirements:
- Setup service worker
- Add offline functionality
- Implement app manifest
- Add push notifications
- Create install prompts

#### Files to Create:
```
public/
├── manifest.json
├── service-worker.js
└── icons/
src/
└── hooks/
    └── usePWA.ts
```

#### Acceptance Criteria:
- [ ] App can be installed
- [ ] Offline functionality works
- [ ] Push notifications are configured
- [ ] App manifest is correct
- [ ] Service worker caches properly

---

## Phase 8: Testing & Optimization (2 Sessions)

### Session 17: Testing Implementation
**Duration**: 1-2 hours  
**Objective**: Add comprehensive testing

#### Requirements:
- Setup testing environment
- Write unit tests for components
- Add integration tests
- Implement E2E tests
- Add visual regression tests

#### Files to Create:
```
src/
└── __tests__/
    ├── components/
    ├── hooks/
    ├── utils/
    └── integration/
cypress/
├── e2e/
└── support/
```

#### Acceptance Criteria:
- [ ] Unit tests pass
- [ ] Integration tests work
- [ ] E2E tests cover critical paths
- [ ] Test coverage is >80%
- [ ] Visual regression tests pass

---

### Session 18: Performance Optimization
**Duration**: 1-2 hours  
**Objective**: Optimize application performance

#### Requirements:
- Implement code splitting
- Optimize bundle size
- Add performance monitoring
- Optimize images and assets
- Add caching strategies

#### Files to Create:
```
src/
├── utils/
│   └── performance.ts
└── config/
    └── performance.ts
```

#### Acceptance Criteria:
- [ ] Bundle size is optimized
- [ ] Code splitting works
- [ ] Performance metrics are good
- [ ] Caching is effective
- [ ] Lighthouse score >90

---

## Session Template for Agent Mode

### Before Each Session:
1. **Clear Objective**: Define what you want to build
2. **Specific Requirements**: List all features needed
3. **Acceptance Criteria**: Define what "done" looks like
4. **Files to Create**: Plan the file structure
5. **Dependencies**: Ensure required packages are installed

### Example Session Prompts:

#### Session 1: Project Setup & Configuration
```
"Help me set up a new React TypeScript project for my cryptocurrency trading platform.

Requirements:
- Create a new Vite + React + TypeScript project
- Install and configure Tailwind CSS with a trading-specific theme
- Setup ESLint and Prettier for code formatting
- Create the basic folder structure for the project
- Configure environment variables

Files to create:
- tailwind.config.js (with trading colors: profit green, loss red, etc.)
- vite.config.ts
- tsconfig.json
- .eslintrc.js
- .prettierrc
- src/config/environment.ts
- src/styles/globals.css (with Tailwind directives)

Dependencies to install:
- @headlessui/react @tanstack/react-query react-hook-form zod recharts socket.io-client zustand react-router-dom
- tailwindcss @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

The project should be ready to run with 'npm run dev' and have Tailwind CSS working with custom trading colors."
```

#### Session 2: Basic Layout & Routing
```
"Help me create the basic layout and routing structure for my cryptocurrency trading platform.

Requirements:
- Setup React Router v6 with routes for Dashboard, Trading, Portfolio, Profile, Login, Register
- Create a responsive layout with Header, Sidebar, and Footer components
- Implement navigation between all routes
- Make the layout mobile-responsive with collapsible sidebar
- Use Tailwind CSS for styling

Files to create:
- src/components/layout/Header.tsx
- src/components/layout/Sidebar.tsx
- src/components/layout/Footer.tsx
- src/components/layout/Layout.tsx
- src/pages/Dashboard.tsx
- src/pages/Trading.tsx
- src/pages/Portfolio.tsx
- src/pages/Profile.tsx
- src/pages/Login.tsx
- src/pages/Register.tsx
- src/App.tsx

The layout should be responsive, with a sidebar that collapses on mobile, and all routes should work properly."
```

#### Session 3: Authentication Context & Hooks
```
"Help me set up the authentication system for my cryptocurrency trading platform.

Requirements:
- Create an authentication context to manage user state
- Setup JWT token management with secure storage
- Create an auth service for API calls
- Implement a protected route wrapper
- Add automatic token refresh logic

Files to create:
- src/context/AuthContext.tsx
- src/hooks/useAuth.ts
- src/services/auth.service.ts
- src/components/auth/ProtectedRoute.tsx
- src/types/auth.types.ts

The auth context should manage user state, handle JWT tokens securely, and provide login/logout functionality. Protected routes should redirect unauthenticated users to login."
```

#### Session 4: Login & Registration Forms
```
"Help me build the login and registration forms for my cryptocurrency trading platform.

Requirements:
- Create login form with React Hook Form + Zod validation
- Create registration form with validation
- Include email and password fields with proper validation
- Show validation errors and loading states
- Handle API responses and redirects on success
- Use Tailwind CSS for styling

Files to create:
- src/components/auth/LoginForm.tsx
- src/components/auth/RegisterForm.tsx
- src/utils/validators.ts
- src/schemas/auth.schemas.ts

The forms should validate input correctly, show error messages, have loading states during submission, and redirect to dashboard on successful login/registration."
```

#### Session 5: API Setup & React Query Configuration
```
"Help me set up the API integration and React Query configuration for my cryptocurrency trading platform.

Requirements:
- Configure Axios with interceptors for JWT token handling
- Setup React Query client with caching
- Create base API service with error handling
- Create market and trading service files
- Add request/response logging

Files to create:
- src/services/api.ts
- src/services/market.service.ts
- src/services/trading.service.ts
- src/hooks/useMarketData.ts
- src/hooks/useTrading.ts
- src/types/market.types.ts
- src/types/trading.types.ts

The API setup should handle authentication automatically, cache responses with React Query, and provide proper error handling for all API calls."
```

#### Session 6: Zustand State Management
```
"Help me set up Zustand state management for my cryptocurrency trading platform.

Requirements:
- Create auth store for user state management
- Create market store for market data
- Create UI store for app state (modals, themes, etc.)
- Implement optimistic updates for better UX
- Add persistence for important state

Files to create:
- src/store/authStore.ts
- src/store/marketStore.ts
- src/store/uiStore.ts
- src/hooks/useAuthStore.ts
- src/hooks/useMarketStore.ts
- src/hooks/useUIStore.ts

The stores should manage state correctly, support optimistic updates, persist important data, and be properly typed with TypeScript."
```

#### Session 7: Market Data Display
```
"Help me create the market data display components for my cryptocurrency trading platform.

Requirements:
- Display current market cycle status
- Show coin listing with prices, changes, and market cap
- Implement sorting and filtering functionality
- Add search functionality for coins
- Create market status indicators with color coding

Files to create:
- src/components/market/MarketOverview.tsx
- src/components/market/CoinList.tsx
- src/components/market/CoinCard.tsx
- src/components/market/MarketStatus.tsx
- src/components/ui/DataTable.tsx
- src/components/ui/SearchInput.tsx
- src/components/ui/FilterDropdown.tsx
- src/utils/formatters.ts

The market display should show real-time data, allow sorting/filtering, and use color coding for profit/loss indicators."
```

#### Session 8: Price Charts Integration
```
"Help me integrate Recharts for price visualization in my cryptocurrency trading platform.

Requirements:
- Create price chart component using Recharts
- Implement time range selectors (1H, 24H, 7D, ALL)
- Add chart interactions (zoom, pan, hover)
- Display price history data with proper formatting
- Add chart tooltips and legends

Files to create:
- src/components/charts/PriceChart.tsx
- src/components/charts/ChartControls.tsx
- src/components/charts/ChartTooltip.tsx
- src/hooks/useChartData.ts

The charts should render price data correctly, support different time ranges, have smooth interactions, and be responsive on mobile devices."
```

#### Session 9: Real-time Price Updates
```
"Help me implement WebSocket integration for real-time price updates in my cryptocurrency trading platform.

Requirements:
- Setup Socket.io client connection
- Implement real-time price updates every 5 seconds
- Add connection status indicators
- Handle connection failures with automatic reconnection
- Add price change animations with Tailwind

Files to create:
- src/services/websocket.service.ts
- src/hooks/useWebSocket.ts
- src/components/ui/ConnectionStatus.tsx
- src/components/ui/PriceIndicator.tsx
- src/utils/websocket.ts

The WebSocket should connect automatically, update prices in real-time, show connection status, and handle disconnections gracefully with reconnection logic."
```

#### Session 10: Trading Forms
```
"Help me create the trading forms for my cryptocurrency trading platform.

Requirements:
- Build buy order form with React Hook Form + Zod validation
- Build sell order form with validation
- Add order preview functionality
- Implement real-time calculations for order totals
- Add rate limiting to prevent rapid submissions

Files to create:
- src/components/trading/BuyForm.tsx
- src/components/trading/SellForm.tsx
- src/components/trading/OrderPreview.tsx
- src/components/trading/TradingCalculator.tsx
- src/hooks/useTrading.ts

The forms should validate input correctly, show real-time calculations, display order previews, and prevent spam submissions with rate limiting."
```

#### Session 11: Transaction Processing
```
"Help me connect the trading forms to the API and handle transactions in my cryptocurrency trading platform.

Requirements:
- Connect buy/sell forms to trading API endpoints
- Implement order confirmation flow with modals
- Add success/error handling with toast notifications
- Create transaction history display
- Add optimistic updates for better UX

Files to create:
- src/components/trading/OrderConfirmation.tsx
- src/components/trading/TransactionHistory.tsx
- src/components/trading/OrderStatus.tsx
- src/services/transaction.service.ts
- src/hooks/useTransactions.ts

The transaction processing should handle API calls, show confirmation modals, display success/error messages, and update the UI optimistically."
```

#### Session 12: Coin Detail Pages
```
"Help me create comprehensive coin detail pages for my cryptocurrency trading platform.

Requirements:
- Display detailed coin information (price, market cap, supply, etc.)
- Show price charts for specific coins
- Integrate trading forms on the same page
- Add coin metadata display (founder info, etc.)
- Implement mobile optimization

Files to create:
- src/components/trading/CoinDetails.tsx
- src/components/trading/CoinMetadata.tsx
- src/components/trading/CoinTrading.tsx
- src/pages/CoinPage.tsx

The coin detail pages should show comprehensive information, include trading functionality, and work well on both desktop and mobile devices."
```

#### Session 13: Portfolio Overview
```
"Help me create the portfolio overview components for my cryptocurrency trading platform.

Requirements:
- Display user holdings with quantities and current values
- Calculate and show portfolio metrics (total value, profit/loss)
- Show profit/loss indicators with color coding
- Add portfolio charts using Recharts
- Implement real-time updates for portfolio values

Files to create:
- src/components/portfolio/PortfolioOverview.tsx
- src/components/portfolio/HoldingsList.tsx
- src/components/portfolio/PortfolioChart.tsx
- src/components/portfolio/PortfolioMetrics.tsx
- src/hooks/usePortfolio.ts

The portfolio should display holdings correctly, calculate accurate metrics, show profit/loss with colors, and update in real-time as prices change."
```

#### Session 14: Transaction History & Analytics
```
"Help me build the transaction history and performance analytics for my cryptocurrency trading platform.

Requirements:
- Create transaction history display with pagination
- Add filtering and search functionality
- Implement performance analytics with charts
- Add export functionality for transaction data
- Show detailed transaction information

Files to create:
- src/components/portfolio/TransactionHistory.tsx
- src/components/portfolio/PerformanceAnalytics.tsx
- src/components/portfolio/ExportOptions.tsx
- src/utils/analytics.ts

The transaction history should display all transactions, allow filtering/search, show performance analytics, and support data export."
```

#### Session 15: Mobile Responsiveness
```
"Help me optimize the cryptocurrency trading platform for mobile devices.

Requirements:
- Implement responsive design for all components
- Add touch gestures for mobile interactions
- Optimize charts for mobile viewing
- Improve mobile navigation and layout
- Add mobile-specific features

Files to create:
- src/components/mobile/MobileNavigation.tsx
- src/components/mobile/TouchGestures.tsx
- src/components/mobile/MobileCharts.tsx
- src/hooks/useMobile.ts

The mobile optimization should make all features work well on mobile devices with touch-friendly interactions and responsive layouts."
```

#### Session 16: PWA Features
```
"Help me add Progressive Web App features to my cryptocurrency trading platform.

Requirements:
- Setup service worker for offline functionality
- Add app manifest for installation
- Implement push notifications
- Create install prompts
- Add offline fallback pages

Files to create:
- public/manifest.json
- public/service-worker.js
- public/icons/ (various sizes)
- src/hooks/usePWA.ts

The PWA features should allow the app to be installed, work offline, and provide a native app-like experience."
```

#### Session 17: Testing Implementation
```
"Help me add comprehensive testing to my cryptocurrency trading platform.

Requirements:
- Setup testing environment with Jest and React Testing Library
- Write unit tests for components
- Add integration tests for API calls
- Implement E2E tests with Cypress
- Add visual regression tests

Files to create:
- src/__tests__/components/
- src/__tests__/hooks/
- src/__tests__/utils/
- src/__tests__/integration/
- cypress/e2e/
- cypress/support/

The testing should cover components, hooks, utilities, and critical user journeys with good test coverage."
```

#### Session 18: Performance Optimization
```
"Help me optimize the performance of my cryptocurrency trading platform.

Requirements:
- Implement code splitting and lazy loading
- Optimize bundle size with Vite
- Add performance monitoring
- Optimize images and assets
- Implement effective caching strategies

Files to create:
- src/utils/performance.ts
- src/config/performance.ts

The performance optimization should result in faster load times, smaller bundle size, and better overall performance metrics."
```

### After Each Session:
1. **Test Thoroughly**: Ensure everything works
2. **Commit Code**: Save your progress
3. **Document Issues**: Note any problems encountered
4. **Plan Next Session**: Define the next objective

## Tips for Success

### **Development Workflow:**
1. **Start Small**: Begin with simple components
2. **Test Frequently**: Run and test code as you build
3. **Iterate Quickly**: Don't be afraid to refine approaches
4. **Ask Questions**: Clarify requirements when needed

### **Common Pitfalls to Avoid:**
1. **Scope Creep**: Stick to the session objectives
2. **Over-Engineering**: Keep solutions simple
3. **Skipping Tests**: Always test your code
4. **Poor Documentation**: Document your decisions

### **Success Metrics:**
- Each session should result in working, testable code
- Features should be complete and functional
- Code should follow best practices
- Performance should meet requirements

This phased approach will help you build a robust, scalable cryptocurrency trading platform while maximizing the effectiveness of Cursor's agent mode. 