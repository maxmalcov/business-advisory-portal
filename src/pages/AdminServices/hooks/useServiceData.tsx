
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { servicesTable, Service } from '@/integrations/supabase/client';

export const useServiceData = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from Supabase - optimized to prevent flickering
  useEffect(() => {
    let isMounted = true;
    
    const fetchServices = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        
        const { data, error } = await servicesTable()
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && isMounted) {
          // Explicitly cast the data to the Service type
          setServices(data as any as Service[]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load services",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchServices();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await servicesTable()
        .delete()
        .eq('id', serviceId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServices(prev => prev.filter(s => s.id !== serviceId));
      
      toast({
        title: "Service Deleted",
        description: "The service has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    setServices,
    loading,
    setLoading,
    handleDelete
  };
};
