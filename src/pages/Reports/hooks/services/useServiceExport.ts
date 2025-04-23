
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest, ServiceFilters } from '../types/serviceTypes';

export const useServiceExport = () => {
  const { toast } = useToast();

  const exportToCSV = (serviceRequests: ServiceRequest[], filters: ServiceFilters) => {
    if (serviceRequests.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data matching your current filters to export.",
      });
      return;
    }
    
    try {
      // Generate CSV content
      const headers = ["User", "Email", "Service", "Status", "Date Requested", "Completion Date"];
      const rows = serviceRequests.map(request => [
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

  return { exportToCSV };
};
