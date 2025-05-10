import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  setDateRange,
  isOpen,
  onOpenChange,
}) => {
  // Format the date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return 'Select dates';
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 px-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 mr-1" />
          <span className="max-w-[120px] truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3 space-y-3">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium">From</label>
              <input
                type="date"
                className="h-8 w-full rounded-md border border-input px-3 py-1 text-sm"
                value={
                  dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setDateRange((prev) => ({
                    ...prev,
                    from: date,
                  }));
                }}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">To</label>
              <input
                type="date"
                className="h-8 w-full rounded-md border border-input px-3 py-1 text-sm"
                value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setDateRange((prev) => ({
                    ...prev,
                    to: date,
                  }));
                }}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
