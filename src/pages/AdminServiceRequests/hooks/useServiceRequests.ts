
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

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

// Mock data
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
  }
];

export const useServiceRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>('all');
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = useCallback((requestId: string, newStatus: ServiceStatus) => {
    if (newStatus === 'all') return;
    
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

  const openDetailsDialog = useCallback((request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  }, []);

  const handleSaveNotes = useCallback(async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    // Simulate API call
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
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loading,
    filteredRequests,
    selectedRequest,
    isDialogOpen,
    setIsDialogOpen,
    adminNotes,
    setAdminNotes,
    handleUpdateStatus,
    openDetailsDialog,
    handleSaveNotes
  };
};
