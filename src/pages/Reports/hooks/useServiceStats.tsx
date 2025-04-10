
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ServicesStats } from './types';

export const useServiceStats = () => {
  const { toast } = useToast();
  const [servicesStats, setServicesStats] = useState<ServicesStats>({
    completed: 0,
    pending: 0,
    requested: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServiceStats = async () => {
      try {
        const { data: services, error: servicesError } = await supabase
          .from('service_requests')
          .select('*');
        
        if (servicesError) throw servicesError;
        
        if (services) {
          const completed = services.filter(svc => svc.status === 'completed');
          const pending = services.filter(svc => svc.status === 'pending');
          
          setServicesStats({
            completed: completed.length,
            pending: pending.length,
            requested: services.length,
          });
        } else {
          // Use default values if no data returned
          setServicesStats({
            completed: 0,
            pending: 0,
            requested: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching service stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching service stats'));
        
        // Use mock data as fallback
        setServicesStats({
          completed: 18,
          pending: 7,
          requested: 25,
        });
        
        toast({
          variant: "destructive",
          title: "Error loading service data",
          description: "There was a problem loading your service data. Using mock data instead.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceStats();
  }, [toast]);

  return {
    servicesStats,
    loading,
    error
  };
};
