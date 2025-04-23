
import React from 'react';
import { DateFilter } from '@/pages/AdminUserManagement/components/UserEditDialog/ActivityTab/DateFilter';
import { DateFilterOption, DateRange } from '@/pages/AdminUserManagement/hooks/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterInput } from '@/pages/HR/components/FilterInput';
import { Download } from 'lucide-react';

interface InvoiceFiltersProps {
  filterOption: DateFilterOption;
  onFilterChange: (option: DateFilterOption) => void;
  customDateRange: DateRange;
  onCustomDateChange: (range: DateRange) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  typeFilter: 'all' | 'sales' | 'supplier';
  onTypeFilterChange: (value: 'all' | 'sales' | 'supplier') => void;
  users: { id: string; name: string; email: string }[];
  onExport: () => void;
  totalItems: number;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filterOption,
  onFilterChange,
  customDateRange,
  onCustomDateChange,
  userFilter,
  onUserFilterChange,
  typeFilter,
  onTypeFilterChange,
  users,
  onExport,
  totalItems
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Invoice Records</h3>
        <Button 
          onClick={onExport} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={totalItems === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DateFilter
          filterOption={filterOption}
          onFilterChange={onFilterChange}
          customDateRange={customDateRange}
          onCustomDateChange={onCustomDateChange}
        />
        
        <FilterInput 
          value={userFilter}
          onChange={onUserFilterChange}
          placeholder="Search by user name or email"
          className="w-full"
        />
        
        <Select value={typeFilter} onValueChange={(value) => onTypeFilterChange(value as 'all' | 'sales' | 'supplier')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select invoice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sales">Sales Invoices</SelectItem>
            <SelectItem value="supplier">Supplier Invoices</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {totalItems} {totalItems === 1 ? 'invoice' : 'invoices'} {userFilter && 'matching filter'}
      </div>
    </div>
  );
};

export default InvoiceFilters;
