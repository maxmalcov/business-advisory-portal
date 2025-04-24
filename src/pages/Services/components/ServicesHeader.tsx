
import React from 'react';
import { Badge } from 'lucide-react';

export const ServicesHeader = () => {
  return (
    <div className="flex items-center space-x-4 pb-4 border-b">
      <div className="bg-primary/10 p-3 rounded-full">
        <Badge className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Additional Services</h1>
        <p className="text-muted-foreground mt-1">
          Explore our premium services designed to help your business thrive.
        </p>
      </div>
    </div>
  );
};
