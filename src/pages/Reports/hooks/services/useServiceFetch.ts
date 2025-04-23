
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest } from '../types/serviceTypes';
import { mockRequests } from './mockServiceData';

export const useServiceFetch = () => {
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a call to Supabase
        // const { data, error } = await supabase
        //   .from('service_requests')
        //   .select('*')
        //   .order('requestDate', { ascending: false });
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setServiceRequests(mockRequests);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching service requests:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch service requests'));
        
        toast({
          variant: "destructive",
          title: "Error loading service data",
          description: "There was a problem loading the service request data. Using mock data instead.",
        });
        
        setServiceRequests(mockRequests);
        setLoading(false);
      }
    };
    
    fetchServiceRequests();
  }, [toast]);

  return {
    serviceRequests,
    loading,
    error
  };
};
