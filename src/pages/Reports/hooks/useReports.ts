
import { useState, useMemo } from 'react';
import { ReportData, ReportFilters } from '../types';
import { reportsList } from '../mockData';

export const useReports = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    type: null,
    period: null,
    status: null,
  });

  const filteredReports = useMemo(() => {
    return reportsList.filter((report) => {
      const typeMatch = !filters.type || report.type === filters.type;
      const periodMatch = !filters.period || report.period === filters.period;
      const statusMatch = !filters.status || report.status === filters.status;
      return typeMatch && periodMatch && statusMatch;
    });
  }, [reportsList, filters]);

  const handleFilterChange = (key: keyof ReportFilters, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: null,
      period: null,
      status: null,
    });
  };

  const isFiltered = Object.values(filters).some(value => value !== null);

  return {
    reports: filteredReports,
    filters,
    handleFilterChange,
    resetFilters,
    isFiltered,
  };
};
