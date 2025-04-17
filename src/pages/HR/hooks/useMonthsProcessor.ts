
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMonthYearForStorage, getCurrentMonthYear, getLastMonths, getMonthsInYear } from '@/utils/dates';
import { MonthSubmission, WorkHoursSubmission, SubmissionStatus } from './useMonthlySubmissions';
import { addMonths, subMonths, isAfter, startOfMonth } from 'date-fns';

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
    const today = new Date();
    
    // Get months for all years we want to show
    lastFiveYears.forEach(year => {
      const monthsInYear = getMonthsInYear(year);
      
      const monthsWithStatus = monthsInYear.map(date => {
        const monthStr = getMonthYearForStorage(date);
        const submission = submissions.find(s => s.month_year.startsWith(monthStr));
        const isCurrentMonthDate = date.getMonth() === currentMonth.getMonth() && 
                                  date.getFullYear() === currentMonth.getFullYear();
        
        // Check if this is a future month
        const isFutureMonth = isAfter(startOfMonth(date), startOfMonth(today));
        
        // Explicitly type the status as SubmissionStatus
        const status: SubmissionStatus = submission ? 'submitted' : 'pending';
        
        return {
          date,
          status,
          isCurrentMonth: isCurrentMonthDate,
          isFutureMonth,
          submission,
        };
      });
      
      allMonths.push(...monthsWithStatus);
    });
    
    setMonths(allMonths);
  }, [submissions, user?.id, monthCount]);

  // Handle selecting a default non-future month
  useEffect(() => {
    if (months.length > 0) {
      const currentMonthEntry = months.find(month => month.isCurrentMonth);
      
      // If current month is submitted or we're on a future month, find the most recent available month
      if ((currentMonthEntry && currentMonthEntry.status === 'submitted') || 
          (selectedMonth && isAfter(startOfMonth(selectedMonth), startOfMonth(new Date())))) {
        const availableMonths = months
          .filter(month => !month.isFutureMonth)
          .sort((a, b) => b.date.getTime() - a.date.getTime());
        
        if (availableMonths.length > 0) {
          setSelectedMonth(availableMonths[0].date);
          setSelectedYear(availableMonths[0].date.getFullYear());
        }
      }
    }
  }, [months, selectedMonth]);

  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    
    // Find a month in the selected year that matches the current month if possible
    // Make sure it's not a future month
    const today = new Date();
    const currentMonthInYear = new Date(year, today.getMonth(), 1);
    
    // If the month would be in the future, use the current month instead
    if (isAfter(currentMonthInYear, today)) {
      // Find the latest non-future month in this year
      const availableMonths = months
        .filter(month => 
          month.date.getFullYear() === year && 
          !month.isFutureMonth
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      if (availableMonths.length > 0) {
        setSelectedMonth(availableMonths[0].date);
      } else if (year === today.getFullYear()) {
        // If it's the current year but no non-future months were found,
        // use the current month
        setSelectedMonth(new Date(year, today.getMonth(), 1));
      } else {
        // If it's a past year, use December
        setSelectedMonth(new Date(year, 11, 1));
      }
    } else {
      setSelectedMonth(currentMonthInYear);
    }
  };

  // Navigate between months with arrow buttons
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(selectedMonth, 1) 
      : addMonths(selectedMonth, 1);
    
    // Don't allow navigating to future months
    if (isAfter(startOfMonth(newDate), startOfMonth(new Date()))) {
      return;
    }
    
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
