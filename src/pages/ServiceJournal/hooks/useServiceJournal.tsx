
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, serviceRequestsTable } from '@/integrations/supabase/client';

export const useServiceJournal = (userId?: string) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await serviceRequestsTable()
          .select(`
            id,
            service_id,
            service_name,
            status,
            request_date,
            services:service_id (
              description,
              price
            )
          `)
          .eq('client_id', userId)
          .order('request_date', { ascending: false });

        if (error) throw error;

        // Format the data to include service details
        const formattedRequests = data.map(request => ({
          ...request,
          description: request.services?.description,
          price: request.services?.price,
        }));

        setRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: "Error",
          description: "Failed to load service requests. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [userId, toast]);

  const handleRequestService = async (serviceId: string) => {
    if (!userId) return;

    try {
      const serviceDetails = requests.find(r => r.service_id === serviceId);
      if (!serviceDetails) return;

      const { error } = await serviceRequestsTable()
        .insert({
          service_id: serviceId,
          service_name: serviceDetails.service_name,
          client_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      // Optimistically update the UI
      setRequests(prev => [{
        ...serviceDetails,
        id: crypto.randomUUID(),
        status: 'pending',
        request_date: new Date().toISOString()
      }, ...prev]);

      toast({
        title: "Service Requested",
        description: "Your service request has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error requesting service:', error);
      toast({
        title: "Request Failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { requests, isLoading, handleRequestService };
};
