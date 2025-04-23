
import { useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import { ServiceRequest, ServiceFilters, ServiceStats, ServiceChartData } from '../types/serviceTypes';

export const useFilteredServiceData = (serviceRequests: ServiceRequest[], filters: ServiceFilters) => {
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
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.set(monthKey, 0);
    }
    
    // Fill in the actual counts
    filteredRequests.forEach(request => {
      const requestDate = new Date(request.requestDate);
      const monthKey = requestDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      
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

  return {
    filteredRequests,
    serviceStats,
    chartData
  };
};
