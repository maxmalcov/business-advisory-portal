
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMonthYearForStorage, getCurrentMonthYear, getLastMonths } from '@/utils/dates';
import { MonthSubmission, WorkHoursSubmission } from './useMonthlySubmissions';

export const useMonthsProcessor = (
  submissions: WorkHoursSubmission[],
  monthCount: number = 6
) => {
  const { user } = useAuth();
  const [months, setMonths] = useState<MonthSubmission[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(getCurrentMonthYear());

  // Process the submissions data to create a month list
  useEffect(() => {
    if (!user?.id) return;

    const lastMonths = getLastMonths(monthCount);
    const currentMonth = getCurrentMonthYear().toISOString();
    
    const monthsWithStatus: MonthSubmission[] = lastMonths.map(date => {
      const monthStr = getMonthYearForStorage(date);
      const submission = submissions.find(s => s.month_year.startsWith(monthStr));
      const isCurrentMonthDate = date.toISOString().split('T')[0] === currentMonth.split('T')[0];
      
      return {
        date,
        status: submission ? 'submitted' : 'pending',
        isCurrentMonth: isCurrentMonthDate,
        submission,
      };
    });
    
    setMonths(monthsWithStatus);
  }, [submissions, user?.id, monthCount]);

  return {
    months,
    selectedMonth,
    setSelectedMonth
  };
};
