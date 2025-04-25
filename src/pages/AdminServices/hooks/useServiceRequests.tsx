
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, serviceRequestsTable, ServiceRequest } from '@/integrations/supabase/client';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

export const useServiceRequests = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch service requests from Supabase
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await serviceRequestsTable()
          .select('*')
          .order('request_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setServiceRequests(data);
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: "Error",
          description: "Failed to load service requests",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceRequests();
    
    // Set up a realtime subscription for updates to the service_requests table
    const subscription = supabase
      .channel('service_request_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_requests' 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchServiceRequests();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.service_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (requestId: string, newStatus: ServiceStatus) => {
    try {
      const { error } = await serviceRequestsTable()
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openDetailsDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await serviceRequestsTable()
        .update({ admin_notes: adminNotes })
        .eq('id', selectedRequest.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id ? { ...request, admin_notes: adminNotes } : request
        )
      );
      
      setIsDialogOpen(false);
      
      toast({
        title: "Notes Saved",
        description: "Admin notes have been updated for this request.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    serviceRequests,
    setServiceRequests,
    loading,
    filteredRequests,
    selectedRequest,
    setSelectedRequest,  // Make sure this is included in the return value
    isDialogOpen,
    setIsDialogOpen,
    adminNotes,
    setAdminNotes,
    handleUpdateStatus,
    openDetailsDialog,
    handleSaveNotes
  };
};
