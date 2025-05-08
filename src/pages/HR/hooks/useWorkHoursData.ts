
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';
import type { WorkHoursData } from './useEmployeeWorkHours';

export const useWorkHoursData = (selectedMonth: Date) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workHours, setWorkHours] = useState<WorkHoursData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch work hours for the selected month
  const fetchWorkHours = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const formattedMonth = getMonthYearForStorage(selectedMonth);

      const formattedDate = formattedMonth.split('-').map((el, index) => {
        if(index != 2){
          return el
        }
      })
      formattedDate.pop()
      const { data, error } = await employeeWorkHoursTable()
        .select('*')
        .eq('client_id', user.id)
        .eq('month_year', formattedDate.join('-'))
        .order('employee_name', { ascending: true });

      if (error) throw error;

      const mappedData: WorkHoursData[] = (data as any).map(record => ({
        id: record.id,
        employeeId: record.employee_id,
        employeeName: record.employee_name,
        companyName: record.company_name,
        grossSalary: Number(record.gross_salary),
        absenceDays: record.absence_days,
        medicalLeaveDate: record.medical_leave_date,
        notes: record.notes,
      }));

      setWorkHours(mappedData);
    } catch (error) {
      console.error('Error fetching work hours:', error);
      toast({
        title: 'Failed to load work hours',
        description: 'An error occurred while fetching employee work hours.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch work hours when the selected month changes
  useEffect(() => {
    if (user?.id) {
      fetchWorkHours();
    }
  }, [selectedMonth, user?.id]);

  return {
    workHours,
    loading,
    refreshData: fetchWorkHours,
  };
};
