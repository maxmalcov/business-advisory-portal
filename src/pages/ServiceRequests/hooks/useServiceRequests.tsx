
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  id: string;
  serviceName: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  requestDate: string; // ISO date string
  completionDate?: string; // ISO date string, optional
  description?: string;
}

// Mock data - in a real app, this would be fetched from an API
const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    serviceName: 'Annual Tax Filing',
    status: 'Completed',
    requestDate: '2024-01-15T10:30:00Z',
    completionDate: '2024-02-20T14:45:00Z',
    description: 'Preparation and filing of annual tax returns'
  },
  {
    id: '2',
    serviceName: 'Payroll Audit',
    status: 'In Progress',
    requestDate: '2024-03-05T09:15:00Z',
    description: 'Comprehensive audit of payroll systems and processes'
  },
  {
    id: '3',
    serviceName: 'Financial Statement Preparation',
    status: 'Pending',
    requestDate: '2024-04-10T11:00:00Z',
    description: 'Preparation of quarterly financial statements'
  },
  {
    id: '4',
    serviceName: 'Employee Benefits Review',
    status: 'Completed',
    requestDate: '2024-02-18T13:20:00Z',
    completionDate: '2024-03-15T16:30:00Z',
    description: 'Review and optimization of employee benefits package'
  },
  {
    id: '5',
    serviceName: 'Business Registration',
    status: 'Completed',
    requestDate: '2023-11-22T10:00:00Z',
    completionDate: '2023-12-20T09:45:00Z',
    description: 'Registration of new business entity with appropriate authorities'
  }
];

export function useServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch service requests (mock implementation)
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        setServiceRequests(mockServiceRequests);
        setFilteredRequests(mockServiceRequests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load service requests. Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequests();
  }, [toast]);

  // Filter service requests based on search query
  const filterRequests = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredRequests(serviceRequests);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = serviceRequests.filter(request => 
      request.serviceName.toLowerCase().includes(lowercaseQuery) ||
      request.status.toLowerCase().includes(lowercaseQuery) ||
      (request.description && request.description.toLowerCase().includes(lowercaseQuery))
    );

    setFilteredRequests(filtered);
  }, [serviceRequests]);

  return {
    serviceRequests,
    filteredRequests,
    isLoading,
    filterRequests
  };
}
