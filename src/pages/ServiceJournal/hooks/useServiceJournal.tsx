
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, serviceRequestsTable, servicesTable } from '@/integrations/supabase/client';

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
        // First fetch all service requests for this user
        const { data: serviceRequests, error: requestsError } = await serviceRequestsTable()
          .select('*')
          .eq('client_id', userId)
          .order('request_date', { ascending: false });

        if (requestsError) throw requestsError;

        // If we have service requests, fetch the corresponding service details
        if (serviceRequests && serviceRequests.length > 0) {
          // Extract all service IDs to fetch their details
          const serviceIds = serviceRequests.map(request => request.service_id);
          
          // Fetch service details for all service IDs
          const { data: serviceDetails, error: servicesError } = await servicesTable()
            .select('id, description, price')
            .in('id', serviceIds);
            
          if (servicesError) throw servicesError;
          
          // Create a map of service details for quick lookup
          const serviceDetailsMap = {};
          serviceDetails?.forEach(service => {
            serviceDetailsMap[service.id] = service;
          });
          
          // Combine service requests with their details
          const formattedRequests = serviceRequests.map(request => ({
            ...request,
            description: serviceDetailsMap[request.service_id]?.description || 'No description available',
            price: serviceDetailsMap[request.service_id]?.price || 'N/A',
          }));
          
          setRequests(formattedRequests);
        } else {
          setRequests([]);
        }
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

      // Get user profile to include client_name
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('name, companyname')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;

      // Use company name if available, otherwise use name
      const clientName = userProfile.companyname || userProfile.name || 'Client';
      
      const { error } = await serviceRequestsTable()
        .insert({
          service_id: serviceId,
          service_name: serviceDetails.service_name,
          client_id: userId,
          client_name: clientName,
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
