
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceItem, ServiceStatus } from '../types';
import { serviceRequestsTable } from '@/integrations/supabase/client';

export const useServiceRequests = (user: any, services: ServiceItem[], setServices: (services: ServiceItem[]) => void) => {
  const { toast } = useToast();
  const [userRequests, setUserRequests] = useState<{[key: string]: ServiceStatus}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        const requestsMap: {[key: string]: ServiceStatus} = {};
        data.forEach(request => {
          requestsMap[request.service_id] = request.status as ServiceStatus;
        });
        
        console.log('Service requests map:', requestsMap);
        
        setUserRequests(requestsMap);
        
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
  }, [user, setServices]);

  const handleRequestService = async (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to request services.",
        variant: "destructive"
      });
      return;
    }
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`Requesting service ${serviceId} for user ${user.id}`);
      
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

  return { userRequests, isSubmitting, handleRequestService };
};
