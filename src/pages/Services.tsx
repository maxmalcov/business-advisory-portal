
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ServiceCard from './Services/components/ServiceCard';
import ServiceSearch from './Services/components/ServiceSearch';
import { ServiceItem, ServiceStatus } from './Services/types';
import { initialServices } from './Services/mockData';
import { 
  CircleDollarSign, 
  FileText, 
  Users, 
  Package, 
  PackagePlus, 
  Boxes 
} from 'lucide-react';
import { supabase, serviceRequestsTable } from '@/integrations/supabase/client';

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [userRequests, setUserRequests] = useState<{[key: string]: ServiceStatus}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load service request status from database on component mount
  useEffect(() => {
    const loadUserServiceRequests = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching service requests for user:', user.id);
        
        const { data, error } = await serviceRequestsTable()
          .select('service_id, status')
          .eq('client_id', user.id);
        
        if (error) {
          console.error('Error loading service requests:', error);
          return;
        }
        
        console.log('User service requests data:', data);
        
        // Create a map of service_id to status
        const requestsMap: {[key: string]: ServiceStatus} = {};
        data.forEach(request => {
          requestsMap[request.service_id] = request.status as ServiceStatus;
        });
        
        console.log('Service requests map:', requestsMap);
        
        setUserRequests(requestsMap);
        
        // Update local services state with the request status
        setServices(prevServices => 
          prevServices.map(service => ({
            ...service,
            status: requestsMap[service.id] || 'available'
          }))
        );
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    };
    
    loadUserServiceRequests();
  }, [user]);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CircleDollarSign':
        return <CircleDollarSign className="h-5 w-5 text-primary" />;
      case 'FileText':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'Users':
        return <Users className="h-5 w-5 text-primary" />;
      case 'Package':
        return <Package className="h-5 w-5 text-primary" />;
      case 'PackagePlus':
        return <PackagePlus className="h-5 w-5 text-primary" />;
      case 'Boxes':
        return <Boxes className="h-5 w-5 text-primary" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };
  
  const handleRequestService = async (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to request services.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the service by ID
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`Requesting service ${serviceId} for user ${user.id}`);
      
      // Insert the service request into the database
      const { data, error } = await serviceRequestsTable()
        .insert({
          service_id: serviceId,
          service_name: service.title,
          client_id: user.id,
          client_name: user.name || user.email,
          status: 'pending'
        })
        .select();
        
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Service request created:', data);
      
      // Update local state
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === serviceId 
            ? { ...service, status: 'pending' as ServiceStatus } 
            : service
        )
      );
      
      toast({
        title: "Service Requested",
        description: `Your request for ${service.title} has been submitted. The admin has been notified.`,
      });
    } catch (error) {
      console.error('Error requesting service:', error);
      toast({
        title: "Request Failed",
        description: "There was a problem submitting your service request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.additional_services')}</h1>
        <p className="text-muted-foreground">Explore our premium services designed to help your business thrive.</p>
      </div>
      
      {/* Search bar */}
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Services grid */}
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
            onRequestService={handleRequestService}
          />
        ))}
      </div>
      
      {/* Debug information during development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-4 mt-8 text-sm bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info</h3>
          <p>User ID: {user?.id || 'Not logged in'}</p>
          <p>User Requests: {Object.keys(userRequests).length}</p>
          <details>
            <summary className="cursor-pointer text-blue-600">User Requests Data</summary>
            <pre>{JSON.stringify(userRequests, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Services;
