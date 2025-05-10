import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ServicesHeader } from './Services/components/ServicesHeader';
import { ServicesList } from './Services/components/ServicesList';
import ServiceSearch from './Services/components/ServiceSearch';
import { useServices } from './Services/hooks/useServices';
import { useServiceRequests } from './Services/hooks/useServiceRequests';

const Services: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { services, setServices, loading } = useServices();
  const { handleRequestService } = useServiceRequests(
    user,
    services,
    setServices,
  );

  return (
    <div className="space-y-6">
      <ServicesHeader />
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {loading ? (
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
      ) : (
        <ServicesList
          services={services}
          onRequestService={handleRequestService}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default Services;
