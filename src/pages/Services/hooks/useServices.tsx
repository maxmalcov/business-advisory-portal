
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceItem, ServiceStatus } from '../types';
import { servicesTable } from '@/integrations/supabase/client';

export const useServices = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          const serviceItems: ServiceItem[] = data.map((service: any) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            iconName: service.iconname || 'Package',
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

  return { services, setServices, loading };
};
