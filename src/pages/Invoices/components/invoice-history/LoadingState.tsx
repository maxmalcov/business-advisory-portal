import React from 'react';
import { Card } from '@/components/ui/card';

export const LoadingState = () => {
  return (
    <Card className="w-full animate-pulse">
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </Card>
  );
};
