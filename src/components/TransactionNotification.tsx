import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface TransactionNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (type === 'success') {
      return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
    }
    return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
  };

  const getBackgroundColor = () => {
    if (type === 'success') {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getTextColor = () => {
    if (type === 'success') {
      return 'text-green-800 dark:text-green-300';
    }
    return 'text-red-800 dark:text-red-300';
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </p>
            <p className={`text-sm mt-1 ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 ${getTextColor()} hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 dark:focus:ring-offset-green-900/20 focus:ring-green-600`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionNotification; 