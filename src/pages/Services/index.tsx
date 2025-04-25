
import React from 'react';
import { ServicesHeader } from './components/ServicesHeader';
import { ServiceHistory } from './components/ServiceHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceSearch from './components/ServiceSearch';
import { ServicesList } from './components/ServicesList';
import { useServices } from './hooks/useServices';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useState } from 'react';

const Services: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { services, setServices, loading } = useServices();
  const { handleRequestService } = useServiceRequests();

  return (
    <div className="space-y-6">
      <ServicesHeader />
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="available">Available Services</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-6">
          <ServiceSearch value={searchQuery} onChange={setSearchQuery} />
          <ServicesList
            services={services}
            onRequestService={handleRequestService}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <ServiceHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
