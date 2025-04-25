
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Types
export type ServiceStatus = 'all' | 'pending' | 'completed' | 'rejected';

export interface ServiceRequest {
  id: string;
  client_id: string;
  client_name: string;
  service_id: string;
  service_name: string;
  request_date: string;
  updated_at: string;
  status: string;
  admin_notes?: string;
  details?: string;
}

export const useServiceRequests = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>('all');
  
  // For details dialog
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Mock data
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const mockRequests: ServiceRequest[] = [
        {
          id: '1',
          client_id: 'client-001',
          client_name: 'John Doe',
          service_id: 'service-001',
          service_name: 'Financial Consulting',
          request_date: '2025-04-10T09:30:00Z',
          updated_at: '2025-04-10T09:30:00Z',
          status: 'pending',
          details: 'Looking for quarterly financial analysis.'
        },
        {
          id: '2',
          client_id: 'client-002',
          client_name: 'Jane Smith',
          service_id: 'service-002',
          service_name: 'Tax Filing Assistance',
          request_date: '2025-04-08T14:15:00Z',
          updated_at: '2025-04-09T10:20:00Z',
          status: 'completed',
          admin_notes: 'Completed tax filing for 2024.'
        },
        {
          id: '3',
          client_id: 'client-003',
          client_name: 'Robert Johnson',
          service_id: 'service-003',
          service_name: 'Business Plan Development',
          request_date: '2025-04-05T11:45:00Z',
          updated_at: '2025-04-07T16:30:00Z',
          status: 'rejected',
          admin_notes: 'Client requested cancellation.'
        }
      ];
      
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = [...requests];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) => 
          request.client_name.toLowerCase().includes(query) || 
          request.service_name.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter]);

  // Open the details dialog
  const openDetailsDialog = useCallback((request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  }, []);

  // Update request status
  const handleUpdateStatus = useCallback((requestId: string, newStatus: ServiceStatus) => {
    if (newStatus === 'all') return; // 'all' is not a valid status for a request
    
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, updated_at: new Date().toISOString() } 
          : request
      )
    );
    
    toast({
      title: "Status updated",
      description: `Request status has been updated to ${newStatus}.`,
    });
  }, []);

  // Save admin notes
  const handleSaveNotes = useCallback(async () => {
    if (!selectedRequest) return;
    
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, admin_notes: adminNotes, updated_at: new Date().toISOString() } 
          : request
      )
    );
    
    toast({
      title: "Notes saved",
      description: "Admin notes have been successfully saved.",
    });
    
    setLoading(false);
    setIsDialogOpen(false);
  }, [selectedRequest, adminNotes]);

  return {
    requests,
    filteredRequests,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedRequest,
    isDialogOpen,
    setIsDialogOpen,
    adminNotes,
    setAdminNotes,
    openDetailsDialog,
    handleUpdateStatus,
    handleSaveNotes
  };
};
