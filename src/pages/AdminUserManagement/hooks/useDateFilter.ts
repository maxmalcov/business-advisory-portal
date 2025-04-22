
import { useState, useCallback, useMemo } from 'react';
import { subDays } from 'date-fns';
import { DateFilterOption, DateRange } from './types';

export const useDateFilter = (defaultFilter: DateFilterOption = '30days') => {
  const [filterOption, setFilterOption] = useState<DateFilterOption>(defaultFilter);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const currentDateRange = useMemo(() => {
    const now = new Date();
    switch (filterOption) {
      case '7days':
        return {
          from: subDays(now, 7),
          to: now
        };
      case '30days':
        return {
          from: subDays(now, 30),
          to: now
        };
      case 'custom':
        return customDateRange;
      case 'all':
        return {
          from: undefined,
          to: undefined
        };
      default:
        return {
          from: subDays(now, 30),
          to: now
        };
    }
  }, [filterOption, customDateRange]);

  const isWithinDateRange = useCallback((date: Date) => {
    if (filterOption === 'all') return true;
    if (!currentDateRange.from) return true;
    
    // If we have a from date but no to date, check if the date is after from
    if (currentDateRange.from && !currentDateRange.to) {
      return date >= currentDateRange.from;
    }
    
    // If we have both from and to dates, check if the date is between them
    if (currentDateRange.from && currentDateRange.to) {
      return date >= currentDateRange.from && date <= currentDateRange.to;
    }
    
    return true;
  }, [filterOption, currentDateRange]);

  return {
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange,
    isWithinDateRange
  };
};
