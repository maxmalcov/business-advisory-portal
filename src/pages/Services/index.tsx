
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ServicesHeader } from './components/ServicesHeader';
import { ServicesList } from './components/ServicesList';
import ServiceSearch from './components/ServiceSearch';
import { useServices } from './hooks/useServices';
import { useServiceRequests } from './hooks/useServiceRequests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceJournal } from '@/pages/ServiceJournal';

const Services: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { services, setServices, loading } = useServices();
  const { handleRequestService } = useServiceRequests(user, services, setServices);

  return (
    <div className="space-y-6">
      <ServicesHeader />
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Services</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="history">
          <ServiceJournal />
        </TabsContent>
      </Tabs>
      
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-4 mt-8 text-sm bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info</h3>
          <p>User ID: {user?.id || 'Not logged in'}</p>
          <p>Services Count: {services.length}</p>
        </div>
      )}
    </div>
  );
};

export default Services;
