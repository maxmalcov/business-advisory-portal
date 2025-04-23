
import React, { useMemo } from 'react';
import { DateFilter } from '@/pages/AdminUserManagement/components/UserEditDialog/ActivityTab/DateFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FileBarChart } from 'lucide-react';
import { ServiceFilters as ServiceFiltersType } from '../../hooks/types/serviceTypes';

interface ServiceFiltersProps {
  filters: ServiceFiltersType;
  setFilters: (filters: Partial<ServiceFiltersType>) => void;
  onExport: () => void;
  totalItems: number;
  availableServices: string[];
  loading: boolean;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  filters,
  setFilters,
  onExport,
  totalItems,
  availableServices,
  loading
}) => {
  // Map our filter option to DateFilter component's format
  const dateFilterOption = useMemo(() => {
    switch (filters.dateFilterOption) {
      case 'thisMonth': return '30days';
      case 'last3Months': return '30days'; // closest match
      case 'last6Months': return 'custom'; // we'll handle it specially
      case 'custom': return 'custom';
      default: return 'all';
    }
  }, [filters.dateFilterOption]);

  const handleDateFilterChange = (option: string) => {
    let newFilter: Partial<ServiceFiltersType> = {};
    
    if (option === '7days') {
      newFilter = { dateFilterOption: 'thisMonth' };
    } else if (option === '30days') {
      newFilter = { dateFilterOption: 'last3Months' };
    } else if (option === 'custom') {
      newFilter = { dateFilterOption: 'custom' };
    } else {
      newFilter = { dateFilterOption: 'allTime' };
    }
    
    setFilters(newFilter);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-[#7E69AB]" />
          <h3 className="text-lg font-medium">Service Requests Analysis</h3>
        </div>
        <Button 
          onClick={onExport} 
          variant="outline" 
          className="flex items-center gap-2 border-[#7E69AB] text-[#7E69AB] hover:bg-[#7E69AB]/10"
          disabled={totalItems === 0 || loading}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateFilter
          filterOption={dateFilterOption}
          onFilterChange={handleDateFilterChange}
          customDateRange={filters.dateRange}
          onCustomDateChange={(range) => setFilters({ dateRange: range })}
        />
        
        <Select 
          value={filters.serviceType} 
          onValueChange={(value) => setFilters({ serviceType: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {availableServices.map(service => (
              <SelectItem key={service} value={service}>{service}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters({ status: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {loading ? (
          'Loading service requests...'
        ) : (
          `Showing ${totalItems} ${totalItems === 1 ? 'request' : 'requests'}`
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;
