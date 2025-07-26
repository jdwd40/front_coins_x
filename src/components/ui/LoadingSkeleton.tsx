import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  className = '',
  lineHeight = 'h-4',
}) => {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={clsx(lineHeight, 'w-full')}
          rounded="sm"
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showButton?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showButton = true,
}) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-sm p-4', className)}>
      {showImage && (
        <Skeleton className="w-full h-32 mb-4" rounded="lg" />
      )}
      
      {showTitle && (
        <Skeleton className="w-3/4 h-6 mb-2" rounded="sm" />
      )}
      
      {showDescription && (
        <SkeletonText lines={2} className="mb-4" />
      )}
      
      {showButton && (
        <Skeleton className="w-24 h-8" rounded="md" />
      )}
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-4 flex-1"
              rounded="sm"
            />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-4 flex-1"
                  rounded="sm"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SkeletonChartProps {
  className?: string;
  height?: string | number;
}

export const SkeletonChart: React.FC<SkeletonChartProps> = ({
  className = '',
  height = 300,
}) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-sm p-4', className)}>
      <Skeleton className="w-1/3 h-6 mb-4" rounded="sm" />
      <Skeleton
        className="w-full"
        height={height}
        rounded="lg"
      />
    </div>
  );
};

export default Skeleton; 