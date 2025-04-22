
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateFilterOption, DateRange } from '../../../hooks/types';

interface DateFilterProps {
  filterOption: DateFilterOption;
  onFilterChange: (option: DateFilterOption) => void;
  customDateRange: DateRange;
  onCustomDateChange: (range: DateRange) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  filterOption,
  onFilterChange,
  customDateRange,
  onCustomDateChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Select value={filterOption} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      {filterOption === 'custom' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDateRange.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, 'LLL dd, y')} -{' '}
                    {format(customDateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(customDateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customDateRange.from}
              selected={{
                from: customDateRange.from,
                to: customDateRange.to,
              }}
              onSelect={(range) => 
                // Convert the react-day-picker DateRange to our DateRange type
                onCustomDateChange({
                  from: range?.from,
                  to: range?.to
                })
              }
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
