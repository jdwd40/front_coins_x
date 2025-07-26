import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { clsx } from 'clsx';

interface ErrorFallbackProps {
  error?: Error | string;
  resetError?: () => void;
  variant?: 'inline' | 'card' | 'full';
  className?: string;
  showDetails?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  variant = 'inline',
  className = '',
  showDetails = false,
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const baseClasses = 'flex items-start space-x-3 p-4 rounded-lg border';
  
  const variantClasses = {
    inline: 'bg-red-50 border-red-200 text-red-800',
    card: 'bg-white border-red-200 text-red-800 shadow-sm',
    full: 'bg-red-50 border-red-200 text-red-800 min-h-screen flex items-center justify-center',
  };

  const containerClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  if (variant === 'full') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            {errorMessage}
          </p>
          
          {showDetails && errorStack && process.env.NODE_ENV === 'development' && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {errorStack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {errorMessage}
        </p>
        
        {showDetails && errorStack && process.env.NODE_ENV === 'development' && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-red-600 hover:text-red-700">
              Show error details
            </summary>
            <pre className="mt-1 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {errorStack}
            </pre>
          </details>
        )}
      </div>
      
      {resetError && (
        <div className="flex-shrink-0">
          <button
            onClick={handleRetry}
            className="inline-flex items-center text-sm text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  variant = 'error',
  className = '',
}) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div className={clsx(
      'flex items-start space-x-3 p-4 rounded-lg border',
      variantClasses[variant],
      className
    )}>
      <div className="flex-shrink-0">
        <AlertTriangle className={clsx('h-5 w-5', iconClasses[variant])} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {message}
        </p>
      </div>
      
      {onDismiss && (
        <div className="flex-shrink-0">
          <button
            onClick={onDismiss}
            className="inline-flex items-center text-sm hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorFallback; 