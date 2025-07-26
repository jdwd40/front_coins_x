import { useCallback } from 'react';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  dismissNotification,
  dismissAllNotifications,
  showTradeSuccess,
  showTradeError,
  showOrderProcessing,
  showMarketDataError,
  showPriceUpdate,
  showLoginSuccess,
  showLoginError,
  showLogoutSuccess,
  showRegistrationSuccess,
  showRegistrationError,
  showNetworkError,
  showConnectionRestored,
  showConnectionLost,
  showPortfolioUpdate,
  showPortfolioError,
  showApiError,
  withNotification,
  withLoading,
  type NotificationOptions,
} from '../utils/notifications';

export const useNotifications = () => {
  const success = useCallback((message: string, options?: NotificationOptions) => {
    return showSuccess(message, options);
  }, []);

  const error = useCallback((message: string, options?: NotificationOptions) => {
    return showError(message, options);
  }, []);

  const warning = useCallback((message: string, options?: NotificationOptions) => {
    return showWarning(message, options);
  }, []);

  const info = useCallback((message: string, options?: NotificationOptions) => {
    return showInfo(message, options);
  }, []);

  const loading = useCallback((message: string, options?: NotificationOptions) => {
    return showLoading(message, options);
  }, []);

  const dismiss = useCallback((toastId: string) => {
    dismissNotification(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    dismissAllNotifications();
  }, []);

  // Trading-specific notifications
  const tradeSuccess = useCallback((coinSymbol: string, type: 'buy' | 'sell', amount: string) => {
    return showTradeSuccess(coinSymbol, type, amount);
  }, []);

  const tradeError = useCallback((coinSymbol: string, type: 'buy' | 'sell', error?: string) => {
    return showTradeError(coinSymbol, type, error);
  }, []);

  const orderProcessing = useCallback((coinSymbol: string, type: 'buy' | 'sell') => {
    return showOrderProcessing(coinSymbol, type);
  }, []);

  // Market data notifications
  const marketDataError = useCallback((error?: string) => {
    return showMarketDataError(error);
  }, []);

  const priceUpdate = useCallback((coinSymbol: string, priceChange: number) => {
    return showPriceUpdate(coinSymbol, priceChange);
  }, []);

  // Authentication notifications
  const loginSuccess = useCallback((username: string) => {
    return showLoginSuccess(username);
  }, []);

  const loginError = useCallback((error?: string) => {
    return showLoginError(error);
  }, []);

  const logoutSuccess = useCallback(() => {
    return showLogoutSuccess();
  }, []);

  const registrationSuccess = useCallback((username: string) => {
    return showRegistrationSuccess(username);
  }, []);

  const registrationError = useCallback((error?: string) => {
    return showRegistrationError(error);
  }, []);

  // Network notifications
  const networkError = useCallback((error?: string) => {
    return showNetworkError(error);
  }, []);

  const connectionRestored = useCallback(() => {
    return showConnectionRestored();
  }, []);

  const connectionLost = useCallback(() => {
    return showConnectionLost();
  }, []);

  // Portfolio notifications
  const portfolioUpdate = useCallback(() => {
    return showPortfolioUpdate();
  }, []);

  const portfolioError = useCallback((error?: string) => {
    return showPortfolioError(error);
  }, []);

  // API error handler
  const apiError = useCallback((error: any, fallbackMessage = 'An error occurred') => {
    return showApiError(error, fallbackMessage);
  }, []);

  // Promise wrappers
  const withNotificationWrapper = useCallback(async <T>(
    promise: Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    return withNotification(promise, successMessage, errorMessage);
  }, []);

  const withLoadingWrapper = useCallback(async <T>(
    promise: Promise<T>,
    loadingMessage: string,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    return withLoading(promise, loadingMessage, successMessage, errorMessage);
  }, []);

  return {
    // Basic notifications
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    
    // Trading notifications
    tradeSuccess,
    tradeError,
    orderProcessing,
    
    // Market notifications
    marketDataError,
    priceUpdate,
    
    // Auth notifications
    loginSuccess,
    loginError,
    logoutSuccess,
    registrationSuccess,
    registrationError,
    
    // Network notifications
    networkError,
    connectionRestored,
    connectionLost,
    
    // Portfolio notifications
    portfolioUpdate,
    portfolioError,
    
    // API error handling
    apiError,
    
    // Promise wrappers
    withNotification: withNotificationWrapper,
    withLoading: withLoadingWrapper,
  };
};

export default useNotifications; 