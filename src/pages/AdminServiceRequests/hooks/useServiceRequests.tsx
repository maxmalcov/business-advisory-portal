
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  id: string;
  client: string;
  service: string;
  status: 'pending' | 'in progress' | 'completed' | 'rejected';
  date: string;
  details?: string;
}

// Mock data for service requests
const mockServiceRequests: ServiceRequest[] = [
  { 
    id: '1', 
    client: 'Acme Corp', 
    service: 'Monthly Accounting', 
    status: 'pending', 
    date: '2024-04-15T10:30:00Z',
    details: 'Need monthly accounting services for our company as per the subscription.'
  },
  { 
    id: '2', 
    client: 'TechGiant Inc.', 
    service: 'Tax Filing', 
    status: 'in progress', 
    date: '2024-04-10T14:45:00Z',
    details: 'Please assist with our quarterly tax filing for Q1 2024.'
  },
  { 
    id: '3', 
    client: 'Local Business LLC', 
    service: 'Payroll Assistance', 
    status: 'completed', 
    date: '2024-04-05T09:15:00Z',
    details: 'Need help with setup and organization of our payroll for 15 employees.'
  },
  { 
    id: '4', 
    client: 'StartUp Solutions', 
    service: 'Business Registration', 
    status: 'rejected', 
    date: '2024-04-01T16:20:00Z',
    details: 'Looking to register our new business entity in Delaware.'
  },
  { 
    id: '5', 
    client: 'Global Traders', 
    service: 'Financial Auditing', 
    status: 'pending', 
    date: '2024-04-12T11:00:00Z',
    details: 'Need a comprehensive audit of our financial statements for 2023.'
  }
];

export function useServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const { toast } = useToast();

  // Fetch service requests (mock implementation)
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServiceRequests(mockServiceRequests);
        setFilteredRequests(mockServiceRequests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  // Filter requests when search or status filter changes
  useEffect(() => {
    let results = [...serviceRequests];
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(request => 
        request.client.toLowerCase().includes(lowerCaseQuery) ||
        request.service.toLowerCase().includes(lowerCaseQuery) ||
        (request.details && request.details.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(results);
  }, [searchQuery, statusFilter, serviceRequests]);

  const openDetailsDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(''); // Reset notes when opening a new request
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    // Update status in both arrays
    const updatedRequests = serviceRequests.map(request => {
      if (request.id === requestId) {
        return { ...request, status: newStatus as 'pending' | 'in progress' | 'completed' | 'rejected' };
      }
      return request;
    });

    setServiceRequests(updatedRequests);

    // Also update in filtered requests
    const updatedFilteredRequests = filteredRequests.map(request => {
      if (request.id === requestId) {
        return { ...request, status: newStatus as 'pending' | 'in progress' | 'completed' | 'rejected' };
      }
      return request;
    });

    setFilteredRequests(updatedFilteredRequests);

    const statusMessages = {
      'in progress': 'Service request has been started',
      'completed': 'Service request has been completed',
      'rejected': 'Service request has been rejected',
    };

    toast({
      title: 'Status Updated',
      description: statusMessages[newStatus as keyof typeof statusMessages] || 'Service request status has been updated',
    });
  };

  const handleSaveNotes = () => {
    toast({
      title: 'Notes Saved',
      description: 'Your notes have been saved successfully',
    });
    setIsDialogOpen(false);
  };

  return {
    serviceRequests,
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
}
