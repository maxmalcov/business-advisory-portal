
import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ServiceStats, 
  ServiceRequest, 
  ServiceChartData,
  ServiceFilters,
  UseServiceStatsReturn
} from './types/serviceTypes';
import { isWithinDateRange } from '@/utils/dates';

const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    serviceName: 'Tax Consulting',
    status: 'completed',
    requestDate: '2025-03-15T10:30:00Z',
    completionDate: '2025-03-22T14:45:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Alice Johnson',
    userEmail: 'alice@example.com',
    serviceName: 'Business Plan Development',
    status: 'in_progress',
    requestDate: '2025-04-02T09:15:00Z',
    completionDate: null
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Robert Davis',
    userEmail: 'robert@example.com',
    serviceName: 'Tax Consulting',
    status: 'requested',
    requestDate: '2025-04-10T16:20:00Z',
    completionDate: null
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emma Wilson',
    userEmail: 'emma@example.com',
    serviceName: 'Financial Analysis',
    status: 'cancelled',
    requestDate: '2025-02-25T11:00:00Z',
    completionDate: null
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Michael Brown',
    userEmail: 'michael@example.com',
    serviceName: 'Business Plan Development',
    status: 'completed',
    requestDate: '2025-03-05T13:40:00Z',
    completionDate: '2025-03-15T09:30:00Z'
  },
  {
    id: '6',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    serviceName: 'Financial Analysis',
    status: 'completed',
    requestDate: '2025-01-10T14:20:00Z',
    completionDate: '2025-01-20T16:15:00Z'
  },
  {
    id: '7',
    userId: 'user6',
    userName: 'Sophia Lee',
    userEmail: 'sophia@example.com',
    serviceName: 'Tax Consulting',
    status: 'in_progress',
    requestDate: '2025-04-15T10:10:00Z',
    completionDate: null
  },
  {
    id: '8',
    userId: 'user7',
    userName: 'William Harris',
    userEmail: 'william@example.com',
    serviceName: 'Accounting Advisory',
    status: 'requested',
    requestDate: '2025-04-18T09:05:00Z',
    completionDate: null
  },
  {
    id: '9',
    userId: 'user8',
    userName: 'Olivia Martinez',
    userEmail: 'olivia@example.com',
    serviceName: 'Business Plan Development',
    status: 'completed',
    requestDate: '2025-02-10T15:30:00Z',
    completionDate: '2025-02-25T13:45:00Z'
  },
  {
    id: '10',
    userId: 'user9',
    userName: 'James Taylor',
    userEmail: 'james@example.com',
    serviceName: 'Tax Consulting',
    status: 'cancelled',
    requestDate: '2025-03-28T11:20:00Z',
    completionDate: null
  }
];

const defaultFilters: ServiceFilters = {
  dateRange: {
    from: subMonths(new Date(), 3),
    to: new Date()
  },
  dateFilterOption: 'last3Months',
  serviceType: 'all',
  status: 'all'
};

export const useServiceStatsReports = (): UseServiceStatsReturn => {
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>(defaultFilters);

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a call to Supabase
        // const { data, error } = await supabase
        //   .from('service_requests')
        //   .select('*')
        //   .order('requestDate', { ascending: false });
        
        // if (error) throw error;
        
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

  // Filter service requests based on filters
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      // Filter by date range
      const requestDate = new Date(request.requestDate);
      
      if (filters.dateFilterOption !== 'allTime') {
        if (filters.dateFilterOption === 'custom' && filters.dateRange.from && filters.dateRange.to) {
          if (!isWithinInterval(requestDate, { 
            start: filters.dateRange.from, 
            end: filters.dateRange.to 
          })) {
            return false;
          }
        }
      }
      
      // Filter by service type
      if (filters.serviceType !== 'all' && request.serviceName !== filters.serviceType) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== 'all' && request.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [serviceRequests, filters]);
  
  // Calculate stats from the filtered requests
  const serviceStats = useMemo<ServiceStats>(() => {
    if (filteredRequests.length === 0) {
      return {
        totalRequests: 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
        mostRequestedService: null
      };
    }

    const completed = filteredRequests.filter(r => r.status === 'completed').length;
    const inProgress = filteredRequests.filter(r => r.status === 'in_progress').length;
    const cancelled = filteredRequests.filter(r => r.status === 'cancelled').length;
    
    // Calculate most requested service
    const serviceCount: Record<string, number> = {};
    filteredRequests.forEach(request => {
      serviceCount[request.serviceName] = (serviceCount[request.serviceName] || 0) + 1;
    });
    
    let mostRequestedService = null;
    let maxCount = 0;
    
    Object.entries(serviceCount).forEach(([service, count]) => {
      if (count > maxCount) {
        mostRequestedService = service;
        maxCount = count;
      }
    });
    
    return {
      totalRequests: filteredRequests.length,
      completed,
      inProgress,
      cancelled,
      mostRequestedService
    };
  }, [filteredRequests]);

  // Generate chart data - monthly counts
  const chartData = useMemo<ServiceChartData[]>(() => {
    const months = new Map<string, number>();
    
    // Generate empty months for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'MMM yyyy');
      months.set(monthKey, 0);
    }
    
    // Fill in the actual counts
    filteredRequests.forEach(request => {
      const requestDate = parseISO(request.requestDate);
      const monthKey = format(requestDate, 'MMM yyyy');
      
      if (months.has(monthKey)) {
        months.set(monthKey, months.get(monthKey)! + 1);
      }
    });
    
    // Convert to array format for the chart
    return Array.from(months).map(([month, count]) => ({
      month,
      count
    }));
  }, [filteredRequests]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredRequests.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data matching your current filters to export.",
      });
      return;
    }
    
    try {
      // Generate CSV content
      const headers = ["User", "Email", "Service", "Status", "Date Requested", "Completion Date"];
      const rows = filteredRequests.map(request => [
        request.userName,
        request.userEmail,
        request.serviceName,
        request.status.replace('_', ' '),
        format(new Date(request.requestDate), 'yyyy-MM-dd'),
        request.completionDate ? format(new Date(request.completionDate), 'yyyy-MM-dd') : 'N/A'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename based on date range
      let dateRangeText = 'all-time';
      if (filters.dateFilterOption === 'custom' && filters.dateRange.from && filters.dateRange.to) {
        const fromStr = format(filters.dateRange.from, 'yyyyMMdd');
        const toStr = format(filters.dateRange.to, 'yyyyMMdd');
        dateRangeText = `${fromStr}-to-${toStr}`;
      } else if (filters.dateFilterOption !== 'allTime') {
        dateRangeText = filters.dateFilterOption;
      }
      
      link.href = url;
      link.setAttribute('download', `service-stats-${dateRangeText}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Service data has been exported to CSV.",
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting the data to CSV.",
      });
    }
  };

  return {
    serviceStats,
    serviceRequests: filteredRequests,
    chartData,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    exportToCSV
  };
};
