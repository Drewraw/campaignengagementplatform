import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-soft animate-pulse">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div>
              <div className="h-4 bg-muted rounded w-24 mb-1" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-muted rounded-full w-16" />
            <div className="h-4 bg-muted rounded w-12" />
          </div>
        </div>
        
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>

      {/* Product Image */}
      <div className="px-4 mb-4">
        <div className="aspect-video bg-muted rounded-lg" />
      </div>

      {/* Progress Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-8" />
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-3" />

        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-20" />
          <div className="flex items-center space-x-2">
            <div className="h-8 bg-muted rounded w-12" />
            <div className="h-8 bg-muted rounded w-12" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;