
import { useAuth } from '@/context/AuthContext';
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import type { WorkHoursData } from './useEmployeeWorkHours';

export const useWorkHoursOperations = (selectedMonth: Date, refreshData: () => Promise<void>) => {
  const { user } = useAuth();

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
      
      await refreshData(); // Refresh data
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
      await refreshData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  };

  return {
    saveEmployee,
    deleteEmployee,
  };
};
