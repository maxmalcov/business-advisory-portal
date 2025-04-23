
import { useState } from 'react';
import { subMonths } from 'date-fns';
import { ServiceFilters } from '../types/serviceTypes';

const defaultFilters: ServiceFilters = {
  dateRange: {
    from: subMonths(new Date(), 3),
    to: new Date()
  },
  dateFilterOption: 'last3Months',
  serviceType: 'all',
  status: 'all'
};

export const useServiceFilters = () => {
  const [filters, setFilters] = useState<ServiceFilters>(defaultFilters);

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    setFilters: updateFilters
  };
};
