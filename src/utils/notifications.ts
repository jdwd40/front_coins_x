import toast from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  id?: string;
}

// Default notification options
const defaultOptions: NotificationOptions = {
  duration: 4000,
  position: 'top-right',
};

// Success notifications
export const showSuccess = (message: string, options?: NotificationOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    duration: options?.duration || 3000,
  });
};

// Error notifications
export const showError = (message: string, options?: NotificationOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    duration: options?.duration || 5000,
  });
};

// Warning notifications
export const showWarning = (message: string, options?: NotificationOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: '⚠️',
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
    },
  });
};

// Info notifications
export const showInfo = (message: string, options?: NotificationOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: 'ℹ️',
    style: {
      background: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #93c5fd',
    },
  });
};

// Loading notifications
export const showLoading = (message: string, options?: NotificationOptions) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
    duration: Infinity,
  });
};

// Dismiss a specific notification
export const dismissNotification = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all notifications
export const dismissAllNotifications = () => {
  toast.dismiss();
};

// Trading-specific notifications
export const showTradeSuccess = (coinSymbol: string, type: 'buy' | 'sell', amount: string) => {
  const action = type === 'buy' ? 'purchased' : 'sold';
  return showSuccess(`Successfully ${action} ${amount} of ${coinSymbol.toUpperCase()}`);
};

export const showTradeError = (coinSymbol: string, type: 'buy' | 'sell', error?: string) => {
  const action = type === 'buy' ? 'purchase' : 'sale';
  const message = error || `Failed to ${action} ${coinSymbol.toUpperCase()}`;
  return showError(message);
};

export const showOrderProcessing = (coinSymbol: string, type: 'buy' | 'sell') => {
  const action = type === 'buy' ? 'purchasing' : 'selling';
  return showLoading(`${action} ${coinSymbol.toUpperCase()}...`);
};

// Market data notifications
export const showMarketDataError = (error?: string) => {
  const message = error || 'Failed to load market data';
  return showError(message);
};

export const showPriceUpdate = (coinSymbol: string, priceChange: number) => {
  const isPositive = priceChange >= 0;
  const changeText = isPositive ? `+${priceChange.toFixed(2)}%` : `${priceChange.toFixed(2)}%`;
  
  return showInfo(`${coinSymbol.toUpperCase()}: ${changeText}`, {
    duration: 2000,
  });
};

// Authentication notifications
export const showLoginSuccess = (username: string) => {
  return showSuccess(`Welcome back, ${username}!`);
};

export const showLoginError = (error?: string) => {
  const message = error || 'Login failed. Please check your credentials.';
  return showError(message);
};

export const showLogoutSuccess = () => {
  return showSuccess('Successfully logged out');
};

export const showRegistrationSuccess = (username: string) => {
  return showSuccess(`Account created successfully! Welcome, ${username}!`);
};

export const showRegistrationError = (error?: string) => {
  const message = error || 'Registration failed. Please try again.';
  return showError(message);
};

// Network notifications
export const showNetworkError = (error?: string) => {
  const message = error || 'Network error. Please check your connection.';
  return showError(message);
};

export const showConnectionRestored = () => {
  return showSuccess('Connection restored');
};

export const showConnectionLost = () => {
  return showWarning('Connection lost. Trying to reconnect...', {
    duration: 3000,
  });
};

// Portfolio notifications
export const showPortfolioUpdate = () => {
  return showInfo('Portfolio updated', {
    duration: 2000,
  });
};

export const showPortfolioError = (error?: string) => {
  const message = error || 'Failed to load portfolio data';
  return showError(message);
};

// Generic API error handler
export const showApiError = (error: any, fallbackMessage = 'An error occurred') => {
  let message = fallbackMessage;
  
  if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        message = 'Bad request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please log in again.';
        break;
      case 403:
        message = 'Access denied.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = `Error ${error.response.status}. Please try again.`;
    }
  }
  
  return showError(message);
};

// Promise wrapper for automatic error handling
export const withNotification = async <T>(
  promise: Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T> => {
  try {
    const result = await promise;
    if (successMessage) {
      showSuccess(successMessage);
    }
    return result;
  } catch (error) {
    showApiError(error, errorMessage);
    throw error;
  }
};

// Loading state wrapper
export const withLoading = async <T>(
  promise: Promise<T>,
  loadingMessage: string,
  successMessage?: string,
  errorMessage?: string
): Promise<T> => {
  const loadingToast = showLoading(loadingMessage);
  
  try {
    const result = await promise;
    dismissNotification(loadingToast);
    if (successMessage) {
      showSuccess(successMessage);
    }
    return result;
  } catch (error) {
    dismissNotification(loadingToast);
    showApiError(error, errorMessage);
    throw error;
  }
}; 