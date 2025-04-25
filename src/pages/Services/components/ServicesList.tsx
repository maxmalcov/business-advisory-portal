
import React from 'react';
import { ServiceItem } from '../types';
import ServiceCard from './ServiceCard';
import { getIconComponent } from '../utils/iconUtils';

interface ServicesListProps {
  services: ServiceItem[];
  onRequestService: (serviceId: string) => void;
  searchQuery: string;
  loading?: boolean;
}

export const ServicesList = ({ services, onRequestService, searchQuery, loading }: ServicesListProps) => {
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <ServiceCard 
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          icon={getIconComponent(service.iconName)}
          price={service.price}
          badges={service.badges}
          popular={service.popular}
          status={service.status}
          onRequestService={onRequestService}
        />
      ))}
    </div>
  );
};
