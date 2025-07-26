export const environment = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'https://jdwd40.com/api-2/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://jdwd40.com/ws',
  
  // Development
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Monitoring
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Feature Flags
  enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

export type Environment = typeof environment; 