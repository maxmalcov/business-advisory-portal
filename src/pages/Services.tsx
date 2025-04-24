
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ServiceCard from './Services/components/ServiceCard';
import ServiceSearch from './Services/components/ServiceSearch';
import { ServiceItem, ServiceStatus } from './Services/types';
import { 
  Puzzle,
  CircleDollarSign, 
  FileText, 
  Users, 
  Package, 
  PackagePlus, 
  Boxes 
} from 'lucide-react';
import { supabase, serviceRequestsTable, servicesTable } from '@/integrations/supabase/client';

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [userRequests, setUserRequests] = useState<{[key: string]: ServiceStatus}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services from database');
        
        const { data, error } = await servicesTable()
          .select('*')
          .eq('status', 'active')
          .order('title');
          
        if (error) {
          console.error('Error fetching services:', error);
          toast({
            title: "Error",
            description: "Could not load services. Please try again later.",
            variant: "destructive"
          });
          return;
        }
        
        console.log('Services fetched from DB:', data);
        
        if (data && data.length > 0) {
          // Convert database services to ServiceItem format for the UI
          const serviceItems: ServiceItem[] = data.map((service: any) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            iconName: service.iconname || 'Package', // Use lowercase iconname from DB
            price: service.price.toString(),
            badges: service.badges || [],
            popular: service.popular || false,
            status: 'available' as ServiceStatus
          }));
          
          setServices(serviceItems);
        } else {
          console.log('No services found in the database');
          setServices([]);
        }
      } catch (err) {
        console.error('Error in fetchServices:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);
  
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
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <Puzzle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Additional Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage optional service offerings and integrations
          </p>
        </div>
      </div>

      {/* Search bar */}
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Services grid */}
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
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No services available at the moment.</p>
        </div>
      ) : (
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
      )}
      
      {/* Debug information during development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-4 mt-8 text-sm bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info</h3>
          <p>User ID: {user?.id || 'Not logged in'}</p>
          <p>Services Count: {services.length}</p>
          <p>User Requests: {Object.keys(userRequests).length}</p>
          <details>
            <summary className="cursor-pointer text-blue-600">Services Data</summary>
            <pre>{JSON.stringify(services, null, 2)}</pre>
          </details>
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
