
import React from 'react';
import { DateFilter } from '@/pages/AdminUserManagement/components/UserEditDialog/ActivityTab/DateFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, FileBarChart } from 'lucide-react';
import { SubscriptionFilters as SubscriptionFiltersType } from '../../hooks/types/subscriptionTypes';

interface SubscriptionFiltersProps {
  filters: SubscriptionFiltersType;
  setFilters: (filters: Partial<SubscriptionFiltersType>) => void;
  onExport: () => void;
  totalItems: number;
  loading: boolean;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  filters,
  setFilters,
  onExport,
  totalItems,
  loading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-[#7E69AB]" />
          <h3 className="text-lg font-medium">Subscription Analysis</h3>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DateFilter
          filterOption={filters.dateFilterOption}
          onFilterChange={(option) => setFilters({ dateFilterOption: option })}
          customDateRange={filters.dateRange}
          onCustomDateChange={(range) => setFilters({ dateRange: range })}
        />
        
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.planType} 
          onValueChange={(value) => setFilters({ planType: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by client name..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="h-10"
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        {loading ? (
          'Loading subscriptions...'
        ) : (
          `Showing ${totalItems} ${totalItems === 1 ? 'subscription' : 'subscriptions'}`
        )}
      </div>
    </div>
  );
};

export default SubscriptionFilters;
