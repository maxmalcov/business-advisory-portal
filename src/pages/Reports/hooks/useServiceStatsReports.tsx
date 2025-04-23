
import { UseServiceStatsReturn } from './types/serviceTypes';
import { useServiceFetch } from './services/useServiceFetch';
import { useServiceFilters } from './services/useServiceFilters';
import { useFilteredServiceData } from './services/useFilteredServiceData';
import { useServiceExport } from './services/useServiceExport';

export const useServiceStatsReports = (): UseServiceStatsReturn => {
  const { serviceRequests, loading, error } = useServiceFetch();
  const { filters, setFilters } = useServiceFilters();
  const { filteredRequests, serviceStats, chartData } = useFilteredServiceData(serviceRequests, filters);
  const { exportToCSV } = useServiceExport();

  return {
    serviceStats,
    serviceRequests: filteredRequests,
    chartData,
    loading,
    error,
    filters,
    setFilters,
    exportToCSV: () => exportToCSV(filteredRequests, filters)
  };
};
