
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { Employee } from '../types/employee';

interface UseEmployeeDetailReturn {
  employee: Employee | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchEmployeeData: (employeeId: string) => Promise<void>;
  handleSave: (updatedEmployee: Employee) => Promise<void>;
}

export function useEmployeeDetail(): UseEmployeeDetailReturn {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEmployeeData = useCallback(async (employeeId: string) => {
    if (!employeeId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching employee data for ID:', employeeId);
      
      const { data, error } = await employeesTable()
        .select('id, full_name, position, status, start_date, end_date, company_name, dni_tie, id_document, weekly_schedule')
        .eq('id', employeeId)
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No employee data found for ID:', employeeId);
        throw new Error('Employee not found');
      }
      
      console.log('Raw employee data from Supabase:', data);
      
      // Type assertion to handle the returned data
      const rowData = data as any;
      
      const employeeData: Employee = {
        id: String(rowData.id || ''),
        fullName: String(rowData.full_name || ''),
        position: String(rowData.position || ''),
        status: (rowData.status as 'active' | 'terminated') || 'active',
        startDate: String(rowData.start_date || ''),
        // Fix: Properly handle endDate as undefined or string
        endDate: rowData.end_date ? String(rowData.end_date) : undefined,
        companyName: String(rowData.company_name || ''),
        dniTie: String(rowData.dni_tie || ''),
        idDocument: String(rowData.id_document || ''),
        weeklySchedule: String(rowData.weekly_schedule || '')
      };
      
      console.log('Employee data fetched successfully:', employeeData);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError('Failed to load employee information. Please try again.');
      toast({
        title: 'Error Loading Data',
        description: 'There was a problem loading the employee information.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSave = async (updatedEmployee: Employee) => {
    if (!employee) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Saving employee update:', updatedEmployee);
      
      const { error } = await employeesTable()
        .update({
          full_name: updatedEmployee.fullName,
          position: updatedEmployee.position,
          status: updatedEmployee.status,
          start_date: updatedEmployee.startDate,
          end_date: updatedEmployee.endDate || null,
          company_name: updatedEmployee.companyName || null,
          dni_tie: updatedEmployee.dniTie || null,
          weekly_schedule: updatedEmployee.weeklySchedule || null
        })
        .eq('id', employee.id);
        
      if (error) throw error;
      
      toast({
        title: 'Employee Updated',
        description: 'Employee information has been successfully updated.',
      });
      
      setEmployee(updatedEmployee);
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee information. Please try again.');
      toast({
        title: 'Error',
        description: 'There was a problem updating the employee information.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    employee,
    isLoading,
    isSubmitting,
    error,
    fetchEmployeeData,
    handleSave
  };
}
