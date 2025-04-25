
import React from 'react';
import { Wrench } from 'lucide-react';

const ServiceCatalogHeader: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Manage available service offerings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalogHeader;
