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
- **React Hot Toast** for notifications
- **React Error Boundary** for error handling
- **Date-fns** for date manipulation
- **Clsx** for conditional classes
- **Lucide React** for icons

## Phase 1: Foundation Setup (3 Sessions)

### Session 1: Project Setup & Configuration
**Duration**: 1-2 hours  
**Objective**: Create the project foundation with all necessary configurations

#### Requirements:
- Create Vite + React + TypeScript project
- Install and configure Tailwind CSS with trading theme
- Setup ESLint, Prettier, and Git hooks
- Configure basic folder structure
- Create environment configuration
- Setup TypeScript path mapping

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
├── .prettierrc
└── .env.example
```

#### Acceptance Criteria:
- [ ] Project runs without errors
- [ ] Tailwind CSS is working with custom theme
- [ ] ESLint and Prettier are configured
- [ ] Basic folder structure is in place
- [ ] Environment variables are configured
- [ ] TypeScript path mapping works

#### Dependencies to Install:
```bash
npm install @headlessui/react @tanstack/react-query react-hook-form zod recharts socket.io-client zustand react-router-dom react-hot-toast react-error-boundary date-fns clsx lucide-react
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

#### Example Prompt:
```
"Help me create the basic layout and routing structure for my cryptocurrency trading platform.

Requirements:
- Setup React Router v6 with basic routes for Dashboard, Trading, Portfolio, Profile, Login, Register
- Create responsive layout components (Header, Sidebar, Footer)
- Implement mobile-first responsive design
- Add navigation structure with proper routing
- Create placeholder pages for all routes

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
- src/App.tsx (updated with routing)

The layout should be responsive, with a collapsible sidebar on mobile and proper navigation between all pages."
```

---

### Session 3: Error Handling & Notifications Setup
**Duration**: 1 hour  
**Objective**: Setup comprehensive error handling and notification system

#### Requirements:
- Setup React Hot Toast for notifications
- Create global error boundary
- Implement error handling patterns
- Add loading skeleton components
- Create notification utilities

#### Files to Create:
```
src/
├── components/
│   └── ui/
│       ├── ErrorBoundary.tsx
│       ├── LoadingSkeleton.tsx
│       ├── ToastContainer.tsx
│       └── ErrorFallback.tsx
├── utils/
│   ├── notifications.ts
│   └── errorHandling.ts
└── hooks/
    └── useNotifications.ts
```

#### Acceptance Criteria:
- [ ] Toast notifications work for success/error messages
- [ ] Error boundary catches and displays errors gracefully
- [ ] Loading skeletons display during loading states
- [ ] Error handling patterns are consistent
- [ ] Notification utilities are reusable

#### Example Prompt:
```
"Help me implement comprehensive error handling and notification system for my cryptocurrency trading platform.

Requirements:
- Setup React Hot Toast for success/error notifications
- Create global error boundary with fallback UI
- Implement error handling patterns for API calls
- Add loading skeleton components for better UX
- Create notification utilities for consistent messaging

Files to create:
- src/components/ui/ErrorBoundary.tsx
- src/components/ui/LoadingSkeleton.tsx
- src/components/ui/ToastContainer.tsx
- src/components/ui/ErrorFallback.tsx
- src/utils/notifications.ts
- src/utils/errorHandling.ts
- src/hooks/useNotifications.ts

The error handling should gracefully handle API errors, network issues, and provide user-friendly error messages with toast notifications."
```

---

## Phase 2: Authentication System (2 Sessions)

### Session 4: Authentication Context & Hooks
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

#### Example Prompt:
```
"Help me set up authentication state management and API services for my cryptocurrency trading platform.

Requirements:
- Create authentication context with React Context API
- Setup JWT token management with secure storage
- Create auth service for API calls with interceptors
- Implement protected route wrapper component
- Add automatic token refresh logic

Files to create:
- src/context/AuthContext.tsx (with user state, login, logout, token management)
- src/hooks/useAuth.ts (custom hook for auth context)
- src/services/auth.service.ts (API calls for login, register, refresh)
- src/components/auth/ProtectedRoute.tsx (route wrapper for protected pages)
- src/types/auth.types.ts (TypeScript interfaces for auth)

The authentication system should handle JWT tokens securely, automatically refresh expired tokens, and protect routes from unauthorized access."
```

---

### Session 5: Login & Registration Forms
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

#### Example Prompt:
```
"Help me build user authentication forms with validation for my cryptocurrency trading platform.

Requirements:
- Create login form with React Hook Form and Zod validation
- Create registration form with comprehensive validation
- Implement form error handling and display
- Add loading states and success feedback
- Handle API responses and automatic redirects

Files to create:
- src/components/auth/LoginForm.tsx (email/password form with validation)
- src/components/auth/RegisterForm.tsx (username/email/password/confirm form)
- src/utils/validators.ts (custom validation functions)
- src/schemas/auth.schemas.ts (Zod schemas for form validation)

The forms should have proper validation, error handling, loading states, and automatically redirect to dashboard on successful authentication."
```

---

## Phase 3: API Integration & State Management (3 Sessions)

### Session 6: API Setup & React Query Configuration
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

#### Example Prompt:
```
"Help me set up API integration with React Query for data fetching in my cryptocurrency trading platform.

Requirements:
- Configure Axios with interceptors for auth and error handling
- Setup React Query client with proper configuration
- Create base API service with common functionality
- Implement comprehensive error handling
- Add request/response logging for debugging

Files to create:
- src/services/api.ts (base API configuration with Axios)
- src/services/market.service.ts (market data API calls)
- src/services/trading.service.ts (trading API calls)
- src/hooks/useMarketData.ts (React Query hooks for market data)
- src/hooks/useTrading.ts (React Query hooks for trading)
- src/types/market.types.ts (market data TypeScript interfaces)
- src/types/trading.types.ts (trading TypeScript interfaces)

The API setup should handle authentication automatically, cache responses efficiently, and provide proper error handling and loading states."
```

---

### Session 7: Zustand State Management
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

#### Example Prompt:
```
"Help me set up client-side state management with Zustand for my cryptocurrency trading platform.

Requirements:
- Create auth store for user state management
- Create market store for market data caching
- Create UI store for application state
- Implement optimistic updates for better UX
- Add persistence for important state across sessions

Files to create:
- src/store/authStore.ts (user authentication state)
- src/store/marketStore.ts (market data and prices)
- src/store/uiStore.ts (UI state like sidebar, modals, etc.)
- src/hooks/useAuthStore.ts (custom hook for auth store)
- src/hooks/useMarketStore.ts (custom hook for market store)
- src/hooks/useUIStore.ts (custom hook for UI store)

The state management should be performant, support optimistic updates, persist important data, and be fully typed with TypeScript."
```

---

### Session 8: Development Tools Setup
**Duration**: 1 hour  
**Objective**: Setup development tools and Storybook for component development

#### Requirements:
- Setup Storybook for component development
- Configure React Query DevTools
- Add React Hook Form DevTools
- Setup MSW for API mocking
- Create development utilities

#### Files to Create:
```
.storybook/
├── main.ts
├── preview.ts
└── manager.ts
src/
├── stories/
│   ├── components/
│   └── pages/
└── utils/
    └── devTools.ts
```

#### Acceptance Criteria:
- [ ] Storybook runs and displays components
- [ ] React Query DevTools work in development
- [ ] MSW can mock API responses
- [ ] Development utilities are available
- [ ] Component documentation is generated

---

## Phase 4: Market Dashboard (3 Sessions)

### Session 9: Market Data Display
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

#### Example Prompt:
```
"Help me create the market overview and coin listing components for my cryptocurrency trading platform.

Requirements:
- Display current market cycle with visual indicators
- Show coin listing with prices, changes, and market data
- Implement sorting and filtering functionality
- Add search functionality for finding specific coins
- Create market status indicators with real-time updates

Files to create:
- src/components/market/MarketOverview.tsx (market cycle and summary)
- src/components/market/CoinList.tsx (table/list of all coins)
- src/components/market/CoinCard.tsx (individual coin display)
- src/components/market/MarketStatus.tsx (market status indicators)
- src/components/ui/DataTable.tsx (reusable table component)
- src/components/ui/SearchInput.tsx (search functionality)
- src/components/ui/FilterDropdown.tsx (filtering options)
- src/utils/formatters.ts (data formatting utilities)

The market display should be responsive, show real-time data, support sorting/filtering, and provide a clean interface for viewing market information."
```

---

### Session 10: Price Charts Integration
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

#### Example Prompt:
```
"Help me integrate Recharts for price visualization in my cryptocurrency trading platform.

Requirements:
- Create price chart component using Recharts
- Implement time range selectors (1H, 24H, 7D, 30D, 1Y)
- Add chart interactions like zoom and pan
- Display price history data with proper formatting
- Add interactive tooltips and legends

Files to create:
- src/components/charts/PriceChart.tsx (main chart component with Recharts)
- src/components/charts/ChartControls.tsx (time range and chart controls)
- src/components/charts/ChartTooltip.tsx (custom tooltip component)
- src/hooks/useChartData.ts (hook for chart data management)

The charts should be responsive, interactive, show real-time data, and provide a professional trading interface with proper time range selection and tooltips."
```

---

### Session 11: Real-time Price Updates
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

#### Example Prompt:
```
"Help me implement WebSocket integration for real-time price updates in my cryptocurrency trading platform.

Requirements:
- Setup Socket.io client connection with automatic reconnection
- Implement real-time price updates across the application
- Add connection status indicators for user feedback
- Handle connection failures gracefully with fallback
- Add smooth price change animations for better UX

Files to create:
- src/services/websocket.service.ts (WebSocket connection management)
- src/hooks/useWebSocket.ts (custom hook for WebSocket data)
- src/components/ui/ConnectionStatus.tsx (connection status indicator)
- src/components/ui/PriceIndicator.tsx (animated price changes)
- src/utils/websocket.ts (WebSocket utilities and helpers)

The WebSocket integration should provide real-time updates, handle connection issues gracefully, and provide visual feedback for price changes and connection status."
```

---

## Phase 5: Trading Interface (3 Sessions)

### Session 12: Trading Forms
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

#### Example Prompt:
```
"Help me create buy and sell order forms for my cryptocurrency trading platform.

Requirements:
- Build buy order form with comprehensive validation
- Build sell order form with quantity validation
- Add order preview functionality showing totals and fees
- Implement real-time calculations for amounts and totals
- Add rate limiting to prevent form submission spam

Files to create:
- src/components/trading/BuyForm.tsx (buy order form with validation)
- src/components/trading/SellForm.tsx (sell order form with validation)
- src/components/trading/OrderPreview.tsx (order summary and preview)
- src/components/trading/TradingCalculator.tsx (real-time calculations)
- src/hooks/useTrading.ts (trading logic and calculations)

The trading forms should validate input properly, show real-time calculations, provide order previews, and handle errors gracefully with proper rate limiting."
```

---

### Session 13: Transaction Processing
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

#### Example Prompt:
```
"Help me connect trading forms to API and handle transactions in my cryptocurrency trading platform.

Requirements:
- Connect trading forms to the trading API endpoints
- Implement order confirmation flow with user confirmation
- Add comprehensive success/error handling
- Create transaction history display component
- Add optimistic updates for better user experience

Files to create:
- src/components/trading/OrderConfirmation.tsx (order confirmation modal)
- src/components/trading/TransactionHistory.tsx (transaction list)
- src/components/trading/OrderStatus.tsx (order status tracking)
- src/services/transaction.service.ts (transaction API calls)
- src/hooks/useTransactions.ts (transaction data management)

The transaction processing should handle orders smoothly, provide clear feedback, show transaction history, and use optimistic updates for a responsive user experience."
```

---

### Session 14: Coin Detail Pages
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

#### Example Prompt:
```
"Help me create comprehensive coin detail pages for my cryptocurrency trading platform.

Requirements:
- Display detailed coin information with metadata
- Show price charts specific to the selected coin
- Integrate trading forms directly on the page
- Add comprehensive coin metadata display
- Implement mobile-optimized layout

Files to create:
- src/components/trading/CoinDetails.tsx (coin information display)
- src/components/trading/CoinMetadata.tsx (coin metadata and stats)
- src/components/trading/CoinTrading.tsx (integrated trading forms)
- src/pages/CoinPage.tsx (main coin detail page)

The coin detail pages should provide comprehensive information, integrate trading functionality, show detailed charts, and work well on both desktop and mobile devices."
```

---

## Phase 6: Portfolio Management (2 Sessions)

### Session 15: Portfolio Overview
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

#### Example Prompt:
```
"Help me create portfolio display and management for my cryptocurrency trading platform.

Requirements:
- Display user holdings with current values and profit/loss
- Calculate comprehensive portfolio metrics
- Show profit/loss indicators with visual feedback
- Add portfolio charts for performance visualization
- Implement real-time updates for portfolio values

Files to create:
- src/components/portfolio/PortfolioOverview.tsx (main portfolio view)
- src/components/portfolio/HoldingsList.tsx (list of user holdings)
- src/components/portfolio/PortfolioChart.tsx (portfolio performance chart)
- src/components/portfolio/PortfolioMetrics.tsx (portfolio statistics)
- src/hooks/usePortfolio.ts (portfolio data management)

The portfolio should display holdings clearly, calculate accurate metrics, show profit/loss with visual indicators, and update in real-time as prices change."
```

---

### Session 16: Transaction History & Analytics
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

#### Example Prompt:
```
"Help me build transaction history and performance analytics for my cryptocurrency trading platform.

Requirements:
- Create comprehensive transaction history display
- Add filtering and search functionality
- Implement pagination for large transaction lists
- Create performance analytics with charts and metrics
- Add export functionality for transaction data

Files to create:
- src/components/portfolio/TransactionHistory.tsx (transaction list with filters)
- src/components/portfolio/PerformanceAnalytics.tsx (performance charts and metrics)
- src/components/portfolio/ExportOptions.tsx (data export functionality)
- src/utils/analytics.ts (analytics calculation utilities)

The transaction history should be searchable, filterable, paginated, and include comprehensive performance analytics with export capabilities."
```

---

## Phase 7: Mobile Optimization & PWA (2 Sessions)

### Session 17: Mobile Responsiveness
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

#### Example Prompt:
```
"Help me optimize the application for mobile devices in my cryptocurrency trading platform.

Requirements:
- Implement comprehensive responsive design
- Add touch gestures for better mobile interaction
- Optimize charts and data visualization for mobile
- Improve mobile navigation and user experience
- Add mobile-specific features and optimizations

Files to create:
- src/components/mobile/MobileNavigation.tsx (mobile-optimized navigation)
- src/components/mobile/TouchGestures.tsx (touch gesture handlers)
- src/components/mobile/MobileCharts.tsx (mobile-optimized charts)
- src/hooks/useMobile.ts (mobile detection and utilities)

The mobile optimization should provide a smooth, touch-friendly experience with optimized charts, navigation, and performance for mobile devices."
```

---

### Session 18: PWA Features
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

#### Example Prompt:
```
"Help me add Progressive Web App features to my cryptocurrency trading platform.

Requirements:
- Setup service worker for offline functionality
- Add offline functionality with cached data
- Implement app manifest for installation
- Add push notifications for price alerts
- Create install prompts for better user experience

Files to create:
- public/manifest.json (PWA manifest configuration)
- public/service-worker.js (service worker for caching)
- public/icons/ (app icons in various sizes)
- src/hooks/usePWA.ts (PWA utilities and install prompts)

The PWA features should allow users to install the app, work offline with cached data, receive push notifications, and provide a native app-like experience."
```

---

## Phase 8: Security & Performance (2 Sessions)

### Session 19: Security Implementation
**Duration**: 1 hour  
**Objective**: Implement security features and input validation

#### Requirements:
- Implement rate limiting
- Add input sanitization
- Setup CSRF protection
- Add security headers
- Create validation utilities

#### Files to Create:
```
src/
├── utils/
│   ├── rateLimiter.ts
│   ├── sanitize.ts
│   └── security.ts
└── hooks/
    └── useSecurity.ts
```

#### Acceptance Criteria:
- [ ] Rate limiting prevents abuse
- [ ] Input is properly sanitized
- [ ] CSRF protection is active
- [ ] Security headers are set
- [ ] Validation prevents malicious input

---

### Session 20: Performance Optimization
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

#### Example Prompt:
```
"Help me optimize the performance of my cryptocurrency trading platform.

Requirements:
- Implement code splitting for better loading performance
- Optimize bundle size and reduce load times
- Add performance monitoring and metrics
- Optimize images and assets for faster loading
- Add effective caching strategies

Files to create:
- src/utils/performance.ts (performance monitoring utilities)
- src/config/performance.ts (performance configuration)

The performance optimization should result in faster loading times, smaller bundle sizes, better caching, and improved overall user experience with a Lighthouse score above 90."
```

---

## Phase 9: Testing & Deployment (3 Sessions)

### Session 21: Testing Implementation
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

#### Example Prompt:
```
"Help me add comprehensive testing to my cryptocurrency trading platform.

Requirements:
- Setup testing environment with Jest and React Testing Library
- Write unit tests for all components and utilities
- Add integration tests for user workflows
- Implement E2E tests with Cypress for critical paths
- Add visual regression tests for UI consistency

Files to create:
- src/__tests__/components/ (component unit tests)
- src/__tests__/hooks/ (custom hook tests)
- src/__tests__/utils/ (utility function tests)
- src/__tests__/integration/ (integration tests)
- cypress/e2e/ (end-to-end tests)
- cypress/support/ (Cypress support files)

The testing implementation should provide comprehensive coverage, test critical user paths, and ensure the application works reliably across different scenarios."
```

---

### Session 22: Deployment Configuration
**Duration**: 1 hour  
**Objective**: Setup deployment and CI/CD configuration

#### Requirements:
- Create Docker configuration
- Setup Nginx configuration
- Configure environment variables
- Add build optimization
- Setup CI/CD pipeline

#### Files to Create:
```
Dockerfile
nginx.conf
.github/
└── workflows/
    └── deploy.yml
```

#### Acceptance Criteria:
- [ ] Docker build works
- [ ] Nginx serves the app correctly
- [ ] Environment variables are configured
- [ ] Build is optimized for production
- [ ] CI/CD pipeline is functional

#### Example Prompt:
```
"Help me set up deployment and CI/CD configuration for my cryptocurrency trading platform.

Requirements:
- Create Docker configuration for containerized deployment
- Setup Nginx configuration for serving the application
- Configure environment variables for different environments
- Add build optimization for production deployment
- Setup CI/CD pipeline with GitHub Actions

Files to create:
- Dockerfile (container configuration)
- nginx.conf (web server configuration)
- .github/workflows/deploy.yml (CI/CD pipeline)

The deployment configuration should enable easy deployment to production, handle environment variables properly, and provide automated CI/CD pipeline for consistent deployments."
```

---

### Session 23: Final Testing & Launch
**Duration**: 1 hour  
**Objective**: Final testing and launch preparation

#### Requirements:
- Run comprehensive tests
- Performance testing
- Security audit
- User acceptance testing
- Launch preparation

#### Files to Create:
```
docs/
├── deployment.md
├── troubleshooting.md
└── user-guide.md
```

#### Acceptance Criteria:
- [ ] All tests pass
- [ ] Performance meets requirements
- [ ] Security audit passes
- [ ] User acceptance testing completed
- [ ] Ready for production launch

#### Example Prompt:
```
"Help me complete final testing and launch preparation for my cryptocurrency trading platform.

Requirements:
- Run comprehensive tests across all environments
- Conduct performance testing to ensure requirements are met
- Perform security audit to identify and fix vulnerabilities
- Complete user acceptance testing with stakeholders
- Prepare launch documentation and guides

Files to create:
- docs/deployment.md (deployment instructions)
- docs/troubleshooting.md (common issues and solutions)
- docs/user-guide.md (user documentation)

The final testing should ensure the application is production-ready, secure, performant, and well-documented for successful launch."
```

---

## Configuration Files

### Environment Variables (.env.example)
```bash
# API Configuration
VITE_API_URL=https://jdwd40.com/api-2/api
VITE_WS_URL=wss://jdwd40.com/ws

# Development
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true

# Monitoring
VITE_SENTRY_DSN=your_sentry_dsn_here

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          forms: ['react-hook-form', 'zod'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://jdwd40.com',
        changeOrigin: true,
      },
    },
  },
})
```

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/services/*": ["src/services/*"],
      "@/store/*": ["src/store/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Complete TypeScript Interfaces

### API Types (src/types/api.types.ts)
```typescript
// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

// Market Types
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  circulating_supply: number;
  total_supply: number;
  founder: string;
  created_at: string;
}

export interface MarketStatus {
  cycle: 'STRONG_BOOM' | 'MILD_BOOM' | 'STABLE' | 'MILD_BUST' | 'STRONG_BUST';
  last_updated: string;
  trend_direction: 'up' | 'down' | 'stable';
}

export interface PriceHistory {
  timestamp: string;
  price: number;
  volume?: number;
}

// Trading Types
export interface Transaction {
  id: string;
  user_id: string;
  coin_id: string;
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
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
```

## Utility Functions

### Formatters (src/utils/formatters.ts)
```typescript
import { format, formatDistance } from 'date-fns';

export const formatCurrency = (amount: number, currency = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-GB').format(value);
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};
```

### Validation Schemas (src/schemas/validation.schemas.ts)
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const buyOrderSchema = z.object({
  coinId: z.string().min(1, 'Coin is required'),
  quantity: z.number().positive('Quantity must be positive'),
  amount: z.number().positive('Amount must be positive'),
});

export const sellOrderSchema = z.object({
  coinId: z.string().min(1, 'Coin is required'),
  quantity: z.number().positive('Quantity must be positive'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BuyOrderFormData = z.infer<typeof buyOrderSchema>;
export type SellOrderFormData = z.infer<typeof sellOrderSchema>;
```

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
- Configure environment variables and TypeScript path mapping

Files to create:
- tailwind.config.js (with trading colors: profit green, loss red, etc.)
- vite.config.ts (with path aliases and build optimization)
- tsconfig.json (with strict mode and path mapping)
- .eslintrc.js
- .prettierrc
- .env.example
- src/config/environment.ts
- src/styles/globals.css (with Tailwind directives)

Dependencies to install:
- @headlessui/react @tanstack/react-query react-hook-form zod recharts socket.io-client zustand react-router-dom react-hot-toast react-error-boundary date-fns clsx lucide-react
- tailwindcss @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

The project should be ready to run with 'npm run dev' and have Tailwind CSS working with custom trading colors."
```

#### Session 3: Error Handling & Notifications Setup - example prompt
```
"Help me implement comprehensive error handling and notification system for my cryptocurrency trading platform.

Requirements:
- Setup React Hot Toast for success/error notifications
- Create global error boundary with fallback UI
- Implement error handling patterns for API calls
- Add loading skeleton components for better UX
- Create notification utilities for consistent messaging

Files to create:
- src/components/ui/ErrorBoundary.tsx
- src/components/ui/LoadingSkeleton.tsx
- src/components/ui/ToastContainer.tsx
- src/components/ui/ErrorFallback.tsx
- src/utils/notifications.ts
- src/utils/errorHandling.ts
- src/hooks/useNotifications.ts

The error handling should gracefully handle API errors, network issues, and provide user-friendly error messages with toast notifications."
```

#### Session 8: Development Tools Setup
```
"Help me set up development tools and Storybook for my cryptocurrency trading platform.

Requirements:
- Setup Storybook for component development and documentation
- Configure React Query DevTools for debugging
- Add React Hook Form DevTools for form debugging
- Setup MSW (Mock Service Worker) for API mocking
- Create development utilities and helpers

Files to create:
- .storybook/main.ts
- .storybook/preview.ts
- .storybook/manager.ts
- src/stories/components/
- src/stories/pages/
- src/utils/devTools.ts

The development tools should help with component development, debugging, and testing with mocked API responses."
```

#### Session 19: Security Implementation
```
"Help me implement security features for my cryptocurrency trading platform.

Requirements:
- Implement rate limiting for API calls and form submissions
- Add input sanitization utilities
- Setup CSRF protection
- Add security headers configuration
- Create validation utilities for preventing malicious input

Files to create:
- src/utils/rateLimiter.ts
- src/utils/sanitize.ts
- src/utils/security.ts
- src/hooks/useSecurity.ts

The security features should prevent abuse, sanitize input, and protect against common web vulnerabilities."
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

This comprehensive phased approach will help you build a robust, scalable, and secure cryptocurrency trading platform while maximizing the effectiveness of Cursor's agent mode.
