import { showApiError, showNetworkError, showConnectionLost } from './notifications';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface NetworkErrorInfo {
  type: 'network' | 'timeout' | 'server' | 'client';
  message: string;
  status?: number;
}

// Error types for different scenarios
export class AppError extends Error {
  public code: string;
  public status?: number;
  public details?: Record<string, any>;

  constructor(message: string, code: string, status?: number, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, status?: number) {
    super(message, 'NETWORK_ERROR', status);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

// Error handler for API responses
export const handleApiError = (error: any): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    };
  }

  if (error?.response) {
    // Axios error response
    const { status, data } = error.response;
    return {
      message: data?.message || `HTTP ${status} Error`,
      code: data?.code || `HTTP_${status}`,
      status,
      details: data?.details,
    };
  }

  if (error?.request) {
    // Network error (no response received)
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  }

  // Generic error
  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

// Error handler for network issues
export const handleNetworkError = (error: any): NetworkErrorInfo => {
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Request timed out. Please try again.',
    };
  }

  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return {
      type: 'network',
      message: 'Network connection failed. Please check your internet connection.',
    };
  }

  if (error?.response?.status >= 500) {
    return {
      type: 'server',
      message: 'Server error. Please try again later.',
      status: error.response.status,
    };
  }

  return {
    type: 'client',
    message: 'An error occurred. Please try again.',
    status: error?.response?.status,
  };
};

// Global error handler
export const handleGlobalError = (error: Error, errorInfo?: React.ErrorInfo) => {
  console.error('Global error caught:', error, errorInfo);

  // Handle different types of errors
  if (error instanceof NetworkError) {
    showNetworkError(error.message);
  } else if (error instanceof AuthenticationError) {
    // Redirect to login or show auth error
    showApiError(error, 'Authentication failed');
  } else if (error instanceof ValidationError) {
    showApiError(error, 'Please check your input');
  } else {
    showApiError(error, 'An unexpected error occurred');
  }

  // Here you could also send to error reporting service
  // Example: Sentry.captureException(error, { extra: errorInfo });
};

// Error boundary error handler
export const handleErrorBoundaryError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('Error boundary caught error:', error, errorInfo);
  
  // Log to error reporting service
  // Example: Sentry.captureException(error, { extra: errorInfo });
  
  // Show user-friendly error
  showApiError(error, 'Something went wrong. Please refresh the page.');
};

// WebSocket error handler
export const handleWebSocketError = (error: Event) => {
  console.error('WebSocket error:', error);
  showConnectionLost();
};

// Form validation error handler
export const handleValidationError = (errors: Record<string, any>): string[] => {
  const errorMessages: string[] = [];
  
  Object.entries(errors).forEach(([field, error]) => {
    if (error?.message) {
      errorMessages.push(`${field}: ${error.message}`);
    }
  });
  
  return errorMessages;
};

// Retry mechanism for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Don't retry on client errors (4xx)
      if ((error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

// Error recovery strategies
export const createErrorRecovery = () => {
  let errorCount = 0;
  let lastErrorTime = 0;
  
  return {
    shouldRetry: (error: any): boolean => {
      const now = Date.now();
      
      // Reset error count if more than 5 minutes have passed
      if (now - lastErrorTime > 5 * 60 * 1000) {
        errorCount = 0;
      }
      
      errorCount++;
      lastErrorTime = now;
      
      // Don't retry if too many errors recently
      if (errorCount > 5) {
        return false;
      }
      
      // Don't retry on client errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      
      return true;
    },
    
    reset: () => {
      errorCount = 0;
      lastErrorTime = 0;
    },
  };
};

// Error logging utility
export const logError = (error: any, context?: string) => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  console.error('Error logged:', errorInfo);
  
  // Here you could send to your error logging service
  // Example: sendToErrorService(errorInfo);
};

// Error monitoring utility
export const createErrorMonitor = () => {
  const errors: Array<{ error: any; timestamp: number; context?: string }> = [];
  
  return {
    capture: (error: any, context?: string) => {
      errors.push({
        error,
        timestamp: Date.now(),
        context,
      });
      
      // Keep only last 100 errors
      if (errors.length > 100) {
        errors.shift();
      }
      
      logError(error, context);
    },
    
    getErrors: () => errors,
    
    clear: () => {
      errors.length = 0;
    },
    
    getErrorRate: (timeWindow: number = 60000): number => {
      const now = Date.now();
      const recentErrors = errors.filter(
        ({ timestamp }) => now - timestamp < timeWindow
      );
      return recentErrors.length;
    },
  };
};

// Export error monitor instance
export const errorMonitor = createErrorMonitor(); 