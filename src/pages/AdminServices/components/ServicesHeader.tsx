
import React from 'react';
import { ServiceFlow } from 'lucide-react';

const ServicesHeader: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <ServiceFlow className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground mt-1">
              Oversee and process all additional service requests from clients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesHeader;
