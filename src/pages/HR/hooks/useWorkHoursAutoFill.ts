
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';
import type { WorkHoursData } from './useEmployeeWorkHours';

export const useWorkHoursAutoFill = (
  selectedMonth: Date,
  workHours: WorkHoursData[],
  lastMonthData: WorkHoursData[],
  isSubmitted: boolean,
  loading: boolean,
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-fill current month with previous month's data if no records exist
  const autoFillFromPreviousMonth = async () => {
    if (workHours.length === 0 && lastMonthData.length > 0 && !isSubmitted) {
      try {
        const formattedMonth = getMonthYearForStorage(selectedMonth);
        
        // Prepare data for insertion
        const dataToInsert = lastMonthData.map(item => ({
          client_id: user?.id,
          month_year: formattedMonth,
          employee_id: item.employeeId,
          employee_name: item.employeeName,
          company_name: item.companyName,
          gross_salary: item.grossSalary,
          absence_days: 0, // Reset for new month
          medical_leave_date: null, // Reset for new month
          notes: item.notes,
        }));
        
        if (dataToInsert.length > 0) {
          await employeeWorkHoursTable().insert(dataToInsert);
          await refreshData(); // Refresh data
          
          toast({
            title: 'Data pre-filled',
            description: 'Employee data has been pre-filled from the previous month.',
          });
        }
      } catch (error) {
        console.error('Error auto-filling data:', error);
        toast({
          title: 'Auto-fill failed',
          description: 'Could not pre-fill data from the previous month.',
          variant: 'destructive',
        });
      }
    }
  };

  // Effect to auto-fill data from previous month if needed
  useEffect(() => {
    if (workHours.length === 0 && lastMonthData.length > 0 && !loading && !isSubmitted) {
      autoFillFromPreviousMonth();
    }
  }, [workHours, lastMonthData, loading, isSubmitted]);

  return {
    autoFillFromPreviousMonth,
  };
};
