import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { ErrorFallback } from './ErrorFallback';
import { Skeleton, SkeletonCard, SkeletonTable } from './LoadingSkeleton';

export const ErrorHandlingDemo: React.FC = () => {
  const notifications = useNotifications();
  const [showError, setShowError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const triggerSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 3000);
  };

  const testNotifications = () => {
    // Test different notification types
    notifications.success('This is a success message!');
    
    setTimeout(() => {
      notifications.error('This is an error message!');
    }, 1000);
    
    setTimeout(() => {
      notifications.warning('This is a warning message!');
    }, 2000);
    
    setTimeout(() => {
      notifications.info('This is an info message!');
    }, 3000);
    
    setTimeout(() => {
      notifications.tradeSuccess('BTC', 'buy', '0.5');
    }, 4000);
    
    setTimeout(() => {
      notifications.priceUpdate('BTC', 5.2);
    }, 5000);
  };

  const testLoadingNotification = () => {
    const loadingToast = notifications.loading('Processing your request...');
    
    setTimeout(() => {
      notifications.dismiss(loadingToast);
      notifications.success('Request completed successfully!');
    }, 3000);
  };

  const testApiError = () => {
    const mockError = {
      response: {
        status: 500,
        data: {
          message: 'Internal server error occurred',
          code: 'INTERNAL_ERROR'
        }
      }
    };
    
    notifications.apiError(mockError, 'Failed to process request');
  };

  if (showError) {
    return (
      <ErrorFallback 
        error="This is a demo error message" 
        variant="card"
        showDetails={true}
      />
    );
  }

  if (showSkeleton) {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Loading States Demo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard showImage={false} />
          <SkeletonCard showButton={false} />
        </div>
        
        <SkeletonTable rows={3} columns={4} />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Error Handling & Notifications Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            
            <div className="space-y-2">
              <button
                onClick={testNotifications}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Test All Notifications
              </button>
              
              <button
                onClick={testLoadingNotification}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test Loading Notification
              </button>
              
              <button
                onClick={testApiError}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Test API Error
              </button>
            </div>
          </div>
          
          {/* Error Handling Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Error Handling</h2>
            
            <div className="space-y-2">
              <button
                onClick={triggerError}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Show Error Fallback
              </button>
              
              <button
                onClick={triggerSkeleton}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Show Loading Skeletons
              </button>
            </div>
          </div>
        </div>
        
        {/* Error Message Examples */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Error Message Examples</h2>
          
          <ErrorFallback 
            error="This is an inline error message" 
            variant="inline"
            resetError={() => console.log('Error reset')}
          />
          
          <ErrorFallback 
            error="This is a card error message" 
            variant="card"
          />
        </div>
        
        {/* Skeleton Examples */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Skeleton Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlingDemo; 