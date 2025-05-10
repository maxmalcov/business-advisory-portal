import React from 'react';
import { EmptyStateProps } from './types';

const EmptyState: React.FC<EmptyStateProps> = ({ isLoading }) => {
  if (isLoading) {
    return <div className="py-6 text-center text-sm">Loading employees...</div>;
  }

  return (
    <div className="py-2 px-2 text-sm text-muted-foreground">
      No available employees found.
    </div>
  );
};

export default EmptyState;
