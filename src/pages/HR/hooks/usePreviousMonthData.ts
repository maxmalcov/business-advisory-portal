
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import type { WorkHoursData } from './useEmployeeWorkHours';

export const usePreviousMonthData = (selectedMonth: Date) => {
  const { user } = useAuth();
  const [lastMonthData, setLastMonthData] = useState<WorkHoursData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch previous month's work hours for prefilling
  const fetchPreviousMonthData = async () => {
    if (!user?.id) return;
    
    try {
      // Getting previous month by subtracting 1 month from the selected month
      const previousMonth = new Date(selectedMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const formattedPrevMonth = getMonthYearForStorage(previousMonth);
      
      const { data, error } = await employeeWorkHoursTable()
        .select('*')
        .eq('client_id', user.id)
        .eq('month_year', formattedPrevMonth)
        .order('employee_name', { ascending: true });
      
      if (error) throw error;
      
      // Explicitly cast data to any first to avoid TypeScript errors
      const recordsArray = data as any[] || [];
      
      // Map database records to frontend format
      const mappedData: WorkHoursData[] = recordsArray.map(record => ({
        employeeId: record.employee_id,
        employeeName: record.employee_name,
        companyName: record.company_name,
        grossSalary: Number(record.gross_salary),
        absenceDays: 0, // Reset absence days for new month
        medicalLeaveDate: null, // Reset medical leave for new month
        notes: record.notes,
      }));
      
      setLastMonthData(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching previous month data:', error);
      setLoading(false);
    }
  };

  // Effect to fetch previous month's data when the selected month changes
  useEffect(() => {
    if (user?.id) {
      fetchPreviousMonthData();
    }
  }, [selectedMonth, user?.id]);

  return {
    lastMonthData,
    hasDataFromPreviousMonth: lastMonthData.length > 0,
    loading,
  };
};
