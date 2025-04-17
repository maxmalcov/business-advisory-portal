
import { useAuth } from '@/context/AuthContext';
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { isAfter, startOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { WorkHoursData } from './useEmployeeWorkHours';

export const useWorkHoursOperations = (selectedMonth: Date, refreshData: () => Promise<void>) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Save a single employee record
  const saveEmployee = async (employee: WorkHoursData): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Prevent saving data for future months
      const today = new Date();
      if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
        toast({
          title: 'Operation blocked',
          description: 'You cannot save data for future months.',
          variant: 'destructive',
        });
        return false;
      }
      
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
      
      await refreshData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to save employee data.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete an employee record
  const deleteEmployee = async (id: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Prevent deleting data for future months
      const today = new Date();
      if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
        toast({
          title: 'Operation blocked',
          description: 'You cannot modify data for future months.',
          variant: 'destructive',
        });
        return false;
      }
      
      await employeeWorkHoursTable().delete().eq('id', id);
      await refreshData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete employee data.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    saveEmployee,
    deleteEmployee,
  };
};
