import { useState, useEffect, useMemo } from 'react';
import {
  format,
  parseISO,
  startOfMonth,
  subMonths,
  isWithinInterval,
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  ServiceStats,
  ServiceRequest,
  ServiceChartData,
  ServiceFilters,
  UseServiceStatsReturn,
} from './types/serviceTypes';
import { isWithinDateRange } from '@/utils/dates';

const defaultFilters: ServiceFilters = {
  dateRange: {
    from: subMonths(new Date(), 3),
    to: new Date(),
  },
  dateFilterOption: 'last3Months',
  serviceType: 'all',
  status: 'all',
};

export const useServiceStatsReports = (): UseServiceStatsReturn => {
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>(defaultFilters);

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);

        // In a real app, this would be a call to Supabase
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('request_date', { ascending: false });

        if (error) {
          throw new Error('DB error');
        }

        const mappedData = data.map((item) => {
          return {
            id: item.id,
            userId: item.client_id,
            userName: item.client_name,
            userEmail: '',
            serviceName: item.service_name,
            status: item.status,
            requestDate: item.request_date,
            completionDate: '',
          };
        });

        setServiceRequests(mappedData as any);

        setLoading(false);

        // if (error) throw error;

        // For demo purposes, we'll use mock data
      } catch (err) {
        console.error('Error fetching service requests:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch service requests'),
        );

        toast({
          variant: 'destructive',
          title: 'Error loading service data',
          description:
            'There was a problem loading the service request data. Using mock data instead.',
        });

        setServiceRequests([]);
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  // Filter service requests based on filters
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter((request) => {
      // Filter by date range
      const requestDate = new Date(request.requestDate);

      if (filters.dateFilterOption !== 'allTime') {
        if (
          filters.dateFilterOption === 'custom' &&
          filters.dateRange.from &&
          filters.dateRange.to
        ) {
          if (
            !isWithinInterval(requestDate, {
              start: filters.dateRange.from,
              end: filters.dateRange.to,
            })
          ) {
            return false;
          }
        }
      }

      // Filter by service type
      if (
        filters.serviceType !== 'all' &&
        request.serviceName !== filters.serviceType
      ) {
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
        mostRequestedService: null,
      };
    }

    const completed = filteredRequests.filter(
      (r) => r.status === 'completed',
    ).length;
    const inProgress = filteredRequests.filter(
      (r) => r.status === 'pending',
    ).length;
    const cancelled = filteredRequests.filter(
      (r) => r.status === 'rejected',
    ).length;

    // Calculate most requested service
    const serviceCount: Record<string, number> = {};
    filteredRequests.forEach((request) => {
      serviceCount[request.serviceName] =
        (serviceCount[request.serviceName] || 0) + 1;
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
      mostRequestedService,
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
    filteredRequests.forEach((request) => {
      const requestDate = parseISO(request.requestDate);
      const monthKey = format(requestDate, 'MMM yyyy');

      if (months.has(monthKey)) {
        months.set(monthKey, months.get(monthKey)! + 1);
      }
    });

    // Convert to array format for the chart
    return Array.from(months).map(([month, count]) => ({
      month,
      count,
    }));
  }, [filteredRequests]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredRequests.length === 0) {
      toast({
        title: 'No data to export',
        description:
          'There is no data matching your current filters to export.',
      });
      return;
    }

    try {
      // Generate CSV content
      const headers = ['User', 'Service', 'Status', 'Date Requested'];
      const rows = filteredRequests.map((request) => [
        request.userName,
        request.serviceName,
        request.status.replace('_', ' '),
        format(new Date(request.requestDate), 'yyyy-MM-dd'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      // Create a download link
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Generate filename based on date range
      let dateRangeText = 'all-time';
      if (
        filters.dateFilterOption === 'custom' &&
        filters.dateRange.from &&
        filters.dateRange.to
      ) {
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
        title: 'Export successful',
        description: 'Service data has been exported to CSV.',
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: 'There was an error exporting the data to CSV.',
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
    exportToCSV,
  };
};
