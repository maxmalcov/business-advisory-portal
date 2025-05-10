import { useState } from 'react';
import { useWorkHoursData } from './useWorkHoursData';
import { usePreviousMonthData } from './usePreviousMonthData';
import { useWorkHoursOperations } from './useWorkHoursOperations';
import { useWorkHoursAutoFill } from './useWorkHoursAutoFill';

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

export const useEmployeeWorkHours = (
  selectedMonth: Date,
  isSubmitted: boolean,
) => {
  // Fetch current month's data
  const { workHours, loading, refreshData } = useWorkHoursData(selectedMonth);

  // Fetch previous month's data
  const { lastMonthData, hasDataFromPreviousMonth } =
    usePreviousMonthData(selectedMonth);

  // Operations for saving and deleting employee data
  const { saveEmployee, deleteEmployee } = useWorkHoursOperations(
    selectedMonth,
    refreshData,
  );

  // Auto-fill functionality
  useWorkHoursAutoFill(
    selectedMonth,
    workHours,
    lastMonthData,
    isSubmitted,
    loading,
    refreshData,
  );

  return {
    workHours,
    loading,
    saveEmployee,
    deleteEmployee,
    refreshData,
    hasDataFromPreviousMonth,
    isSubmitted,
  };
};

export default useEmployeeWorkHours;
