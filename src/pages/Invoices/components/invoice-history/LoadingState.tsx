
import React from 'react';

export const LoadingState = () => {
  return (
    <div className="text-center py-10">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p className="mt-2 text-muted-foreground">Loading invoice history...</p>
    </div>
  );
};
