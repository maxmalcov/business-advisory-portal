
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMonthYearForStorage, getCurrentMonthYear, getLastMonths, getMonthsInYear } from '@/utils/dates';
import { MonthSubmission, WorkHoursSubmission } from './useMonthlySubmissions';
import { addMonths, subMonths } from 'date-fns';

export const useMonthsProcessor = (
  submissions: WorkHoursSubmission[],
  monthCount: number = 6
) => {
  const { user } = useAuth();
  const [months, setMonths] = useState<MonthSubmission[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(getCurrentMonthYear());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Process the submissions data to create a month list for multiple years
  useEffect(() => {
    if (!user?.id) return;

    const lastFiveYears = Array.from(
      { length: 5 },
      (_, i) => new Date().getFullYear() - i
    );
    
    const allMonths: MonthSubmission[] = [];
    const currentMonth = getCurrentMonthYear();
    
    // Get months for all years we want to show
    lastFiveYears.forEach(year => {
      const monthsInYear = getMonthsInYear(year);
      
      const monthsWithStatus = monthsInYear.map(date => {
        const monthStr = getMonthYearForStorage(date);
        const submission = submissions.find(s => s.month_year.startsWith(monthStr));
        const isCurrentMonthDate = date.getMonth() === currentMonth.getMonth() && 
                                   date.getFullYear() === currentMonth.getFullYear();
        
        return {
          date,
          status: submission ? 'submitted' : 'pending',
          isCurrentMonth: isCurrentMonthDate,
          submission,
        };
      });
      
      allMonths.push(...monthsWithStatus);
    });
    
    setMonths(allMonths);
  }, [submissions, user?.id, monthCount]);

  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    
    // Find a month in the selected year that matches the current month if possible
    const monthInSelectedYear = new Date(year, selectedMonth.getMonth(), 1);
    setSelectedMonth(monthInSelectedYear);
  };

  // Navigate between months with arrow buttons
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(selectedMonth, 1) 
      : addMonths(selectedMonth, 1);
    
    setSelectedMonth(newDate);
    setSelectedYear(newDate.getFullYear());
  };

  return {
    months,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    handleYearChange,
    handleNavigateMonth
  };
};
