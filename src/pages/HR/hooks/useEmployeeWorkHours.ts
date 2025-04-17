
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  employeeWorkHoursTable,
  EmployeeWorkHours
} from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';

export type WorkHoursData = {
  id?: string;
  employeeId?: string | null;
  employeeName: string;
  companyName?: string | null;
  grossSalary: number;
  absenceDays?: number | null;
  medicalLeaveDate?: string | null;
  notes?: string | null;
};

export const useEmployeeWorkHours = (selectedMonth: Date, isSubmitted: boolean) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workHours, setWorkHours] = useState<WorkHoursData[]>([]);
  const [lastMonthData, setLastMonthData] = useState<WorkHoursData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch work hours for the selected month
  const fetchWorkHours = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const formattedMonth = getMonthYearForStorage(selectedMonth);
      
      const { data, error } = await employeeWorkHoursTable()
        .select('*')
        .eq('client_id', user.id)
        .eq('month_year', formattedMonth)
        .order('employee_name', { ascending: true });
      
      if (error) throw error;
      
      // Map database records to frontend format
      const mappedData: WorkHoursData[] = (data || []).map(record => ({
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
      
      // Map database records to frontend format
      const mappedData: WorkHoursData[] = (data || []).map(record => ({
        employeeId: record.employee_id,
        employeeName: record.employee_name,
        companyName: record.company_name,
        grossSalary: Number(record.gross_salary),
        absenceDays: 0, // Reset absence days for new month
        medicalLeaveDate: null, // Reset medical leave for new month
        notes: record.notes,
      }));
      
      setLastMonthData(mappedData);
    } catch (error) {
      console.error('Error fetching previous month data:', error);
    }
  };

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
          await fetchWorkHours(); // Refresh data
          
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

  // Save a single employee record
  const saveEmployee = async (employee: WorkHoursData): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const formattedMonth = getMonthYearForStorage(selectedMonth);
      
      if (employee.id) {
        // Update existing record
        await employeeWorkHoursTable()
          .update({
            employee_id: employee.employeeId,
            employee_name: employee.employeeName,
            company_name: employee.companyName,
            gross_salary: employee.grossSalary,
            absence_days: employee.absenceDays || 0,
            medical_leave_date: employee.medicalLeaveDate,
            notes: employee.notes,
          })
          .eq('id', employee.id);
      } else {
        // Insert new record
        await employeeWorkHoursTable().insert({
          client_id: user.id,
          month_year: formattedMonth,
          employee_id: employee.employeeId,
          employee_name: employee.employeeName,
          company_name: employee.companyName,
          gross_salary: employee.grossSalary,
          absence_days: employee.absenceDays || 0,
          medical_leave_date: employee.medicalLeaveDate,
          notes: employee.notes,
        });
      }
      
      await fetchWorkHours(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error saving employee:', error);
      return false;
    }
  };

  // Delete an employee record
  const deleteEmployee = async (id: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      await employeeWorkHoursTable().delete().eq('id', id);
      await fetchWorkHours(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  };

  // Effect to fetch work hours when the selected month changes
  useEffect(() => {
    if (user?.id) {
      fetchWorkHours();
      fetchPreviousMonthData();
    }
  }, [selectedMonth, user?.id]);

  // Effect to auto-fill data from previous month if needed
  useEffect(() => {
    if (workHours.length === 0 && lastMonthData.length > 0 && !loading && !isSubmitted) {
      autoFillFromPreviousMonth();
    }
  }, [workHours, lastMonthData, loading, isSubmitted]);

  return {
    workHours,
    loading,
    saveEmployee,
    deleteEmployee,
    refreshData: fetchWorkHours,
    hasDataFromPreviousMonth: lastMonthData.length > 0,
    isSubmitted,
  };
};

export default useEmployeeWorkHours;
