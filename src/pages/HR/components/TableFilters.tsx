
import React, { useState } from 'react';
import { FilterX, Filter } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { FilterInput } from './FilterInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { EmployeeStatus } from '../types/employee';
import { useIsSmallScreen } from '@/hooks/use-mobile';

export interface FilterOptions {
  textSearch: string;
  position: string;
  status: EmployeeStatus | 'all';
  startDateFrom: Date | null;
  startDateTo: Date | null;
  endDateFrom: Date | null;
  endDateTo: Date | null;
}

interface TableFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  positions: string[];
  showResetButton?: boolean;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filterOptions,
  onFilterChange,
  positions,
  showResetButton = true,
}) => {
  const isSmallScreen = useIsSmallScreen();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  const uniquePositions = Array.from(new Set(['', ...positions]));
  
  const handleTextSearchChange = (value: string) => {
    onFilterChange({ ...filterOptions, textSearch: value });
  };
  
  const handlePositionChange = (value: string) => {
    onFilterChange({ ...filterOptions, position: value });
  };
  
  const handleStatusChange = (value: string) => {
    onFilterChange({ 
      ...filterOptions, 
      status: value as EmployeeStatus | 'all' 
    });
  };
  
  const handleStartDateFromChange = (date: Date | undefined) => {
    onFilterChange({ 
      ...filterOptions, 
      startDateFrom: date || null 
    });
  };
  
  const handleStartDateToChange = (date: Date | undefined) => {
    onFilterChange({ 
      ...filterOptions, 
      startDateTo: date || null 
    });
  };
  
  const handleEndDateFromChange = (date: Date | undefined) => {
    onFilterChange({ 
      ...filterOptions, 
      endDateFrom: date || null 
    });
  };
  
  const handleEndDateToChange = (date: Date | undefined) => {
    onFilterChange({ 
      ...filterOptions, 
      endDateTo: date || null 
    });
  };
  
  const resetFilters = () => {
    onFilterChange({
      textSearch: '',
      position: '',
      status: 'all',
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
    });
  };
  
  const formatDateRange = (fromDate: Date | null, toDate: Date | null) => {
    if (!fromDate && !toDate) return 'Select dates';
    
    const fromStr = fromDate ? format(fromDate, 'MMM d, yyyy') : '';
    const toStr = toDate ? format(toDate, 'MMM d, yyyy') : '';
    
    if (fromDate && toDate) return `${fromStr} - ${toStr}`;
    if (fromDate) return `From ${fromStr}`;
    if (toDate) return `Until ${toStr}`;
    
    return 'Select dates';
  };
  
  // Check if any filter is active
  const isFiltering = 
    filterOptions.textSearch !== '' || 
    filterOptions.position !== '' || 
    filterOptions.status !== 'all' ||
    filterOptions.startDateFrom !== null ||
    filterOptions.startDateTo !== null ||
    filterOptions.endDateFrom !== null ||
    filterOptions.endDateTo !== null;

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
        {/* Text search */}
        <FilterInput
          value={filterOptions.textSearch}
          onChange={handleTextSearchChange}
          placeholder="Search by name, position, or company..."
          className="w-full"
          iconType="search"
        />

        {/* Position filter */}
        <div className="relative">
          <FilterInput
            value={filterOptions.position}
            onChange={handlePositionChange}
            placeholder="Filter by position"
            className="w-full"
            iconType="briefcase"
            as="select"
            selectOptions={uniquePositions.map(pos => ({
              value: pos, 
              label: pos || 'All Positions'
            }))}
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <FilterInput
            value={filterOptions.status}
            onChange={handleStatusChange}
            placeholder="Filter by status"
            className="w-full"
            iconType="userCheck"
            as="select"
            selectOptions={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'terminated', label: 'Terminated' }
            ]}
          />
        </div>

        {/* Start Date Range */}
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center bg-background text-left font-normal"
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {formatDateRange(filterOptions.startDateFrom, filterOptions.startDateTo)}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="text-sm font-medium">Start Date Range</div>
              <div className="text-xs text-muted-foreground">Select start date range</div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              <div>
                <div className="text-xs mb-2">From:</div>
                <Calendar
                  mode="single"
                  selected={filterOptions.startDateFrom || undefined}
                  onSelect={handleStartDateFromChange}
                  className="p-3 pointer-events-auto"
                />
              </div>
              <div>
                <div className="text-xs mb-2">To:</div>
                <Calendar
                  mode="single"
                  selected={filterOptions.startDateTo || undefined}
                  onSelect={handleStartDateToChange}
                  className="p-3 pointer-events-auto"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  handleStartDateFromChange(undefined);
                  handleStartDateToChange(undefined);
                }}
                className="col-span-2"
              >
                Clear Dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Additional filters in second row for end date on small screens */}
      {isSmallScreen && (
        <div className="grid grid-cols-1 gap-4">
          {/* End Date Range */}
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center bg-background text-left font-normal"
              >
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {formatDateRange(filterOptions.endDateFrom, filterOptions.endDateTo) || 'End Date Range'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="text-sm font-medium">End Date Range</div>
                <div className="text-xs text-muted-foreground">Select termination date range</div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div>
                  <div className="text-xs mb-2">From:</div>
                  <Calendar
                    mode="single"
                    selected={filterOptions.endDateFrom || undefined}
                    onSelect={handleEndDateFromChange}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                <div>
                  <div className="text-xs mb-2">To:</div>
                  <Calendar
                    mode="single"
                    selected={filterOptions.endDateTo || undefined}
                    onSelect={handleEndDateToChange}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleEndDateFromChange(undefined);
                    handleEndDateToChange(undefined);
                  }}
                  className="col-span-2"
                >
                  Clear Dates
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* End Date Range for medium and larger screens */}
      {!isSmallScreen && (
        <div className="grid grid-cols-1 gap-4">
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center bg-background text-left font-normal md:w-1/4"
              >
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {formatDateRange(filterOptions.endDateFrom, filterOptions.endDateTo) || 'End Date Range'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="text-sm font-medium">End Date Range</div>
                <div className="text-xs text-muted-foreground">Select termination date range</div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div>
                  <div className="text-xs mb-2">From:</div>
                  <Calendar
                    mode="single"
                    selected={filterOptions.endDateFrom || undefined}
                    onSelect={handleEndDateFromChange}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                <div>
                  <div className="text-xs mb-2">To:</div>
                  <Calendar
                    mode="single"
                    selected={filterOptions.endDateTo || undefined}
                    onSelect={handleEndDateToChange}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleEndDateFromChange(undefined);
                    handleEndDateToChange(undefined);
                  }}
                  className="col-span-2"
                >
                  Clear Dates
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
        
      {/* Filter Controls (Reset button) */}
      {showResetButton && isFiltering && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
