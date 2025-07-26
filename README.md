# Cryptocurrency Trading Platform

A modern React TypeScript application for cryptocurrency trading with real-time market data, portfolio management, and trading capabilities.

## Features

- 🚀 **Modern Tech Stack**: React 18, TypeScript, Vite
- 🎨 **Beautiful UI**: Tailwind CSS with trading-specific design system
- 📊 **Real-time Data**: WebSocket integration for live market updates
- 📱 **Responsive Design**: Mobile-first approach
- 🔒 **Type Safety**: Full TypeScript implementation
- ⚡ **Performance**: Optimized build with code splitting

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Real-time**: Socket.io-client
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Utilities**: Date-fns, clsx

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd front_coins_x
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── ui/            # Basic UI components
│   ├── auth/          # Authentication components
│   ├── market/        # Market data components
│   ├── trading/       # Trading interface components
│   └── portfolio/     # Portfolio management components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── services/          # API services
├── store/             # Zustand stores
├── config/            # Configuration files
└── styles/            # Global styles and Tailwind config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Environment Variables

Create a `.env` file in the root directory:

```env
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

## Trading Colors

The application uses a custom color palette optimized for trading:

- **Profit Colors**: Green shades for positive values
- **Loss Colors**: Red shades for negative values
- **Market Cycles**: Boom (yellow), Bust (pink), Stable (blue)
- **Neutral Colors**: Gray shades for general UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
# front_coins_x
