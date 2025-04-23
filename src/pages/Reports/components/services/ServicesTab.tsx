
import React, { useMemo } from 'react';
import { useServiceStatsReports } from '../../hooks/useServiceStatsReports';
import ServiceFilters from './ServiceFilters';
import ServiceStatsCards from './ServiceStatsCards';
import ServiceChartView from './ServiceChartView';
import ServiceTable from './ServiceTable';

const ServicesTab: React.FC = () => {
  const { 
    serviceStats, 
    serviceRequests, 
    chartData, 
    loading, 
    filters, 
    setFilters,
    exportToCSV
  } = useServiceStatsReports();

  // Extract available services for filter
  const availableServices = useMemo(() => {
    const services = new Set<string>();
    serviceRequests.forEach(request => {
      services.add(request.serviceName);
    });
    return Array.from(services);
  }, [serviceRequests]);

  return (
    <div className="space-y-6">
      <ServiceFilters 
        filters={filters}
        setFilters={setFilters}
        onExport={exportToCSV}
        totalItems={serviceRequests.length}
        availableServices={availableServices}
        loading={loading}
      />

      <ServiceStatsCards stats={serviceStats} loading={loading} />
      
      <ServiceChartView data={chartData} loading={loading} />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Service Request Details</h3>
        <ServiceTable services={serviceRequests} loading={loading} />
      </div>
    </div>
  );
};

export default ServicesTab;
