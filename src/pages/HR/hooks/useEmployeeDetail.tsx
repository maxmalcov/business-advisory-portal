
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
        .select('*')  // Select all fields available
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
        weeklySchedule: String(rowData.weekly_schedule || ''),
        
        // Map any additional fields that might be in the database
        // These will be undefined if not present in the database
        socialSecurityNumber: rowData.social_security_number ? String(rowData.social_security_number) : undefined,
        salary: rowData.salary ? String(rowData.salary) : undefined,
        salaryType: rowData.salary_type as 'gross' | 'net' | undefined,
        iban: rowData.iban ? String(rowData.iban) : undefined,
        email: rowData.email ? String(rowData.email) : undefined,
        address: rowData.address ? String(rowData.address) : undefined,
        comments: rowData.comments ? String(rowData.comments) : undefined
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
      
      // Create an update object with snake_case keys for Supabase
      const updateData = {
        full_name: updatedEmployee.fullName,
        position: updatedEmployee.position,
        status: updatedEmployee.status,
        start_date: updatedEmployee.startDate,
        end_date: updatedEmployee.endDate || null,
        company_name: updatedEmployee.companyName || null,
        dni_tie: updatedEmployee.dniTie || null,
        weekly_schedule: updatedEmployee.weeklySchedule || null,
        id_document: updatedEmployee.idDocument || null
      };
      
      // Add additional fields if they exist in the updated employee data
      if (updatedEmployee.socialSecurityNumber) {
        Object.assign(updateData, { social_security_number: updatedEmployee.socialSecurityNumber });
      }
      
      if (updatedEmployee.salary) {
        Object.assign(updateData, { salary: updatedEmployee.salary });
      }
      
      if (updatedEmployee.salaryType) {
        Object.assign(updateData, { salary_type: updatedEmployee.salaryType });
      }
      
      if (updatedEmployee.iban) {
        Object.assign(updateData, { iban: updatedEmployee.iban });
      }
      
      if (updatedEmployee.email) {
        Object.assign(updateData, { email: updatedEmployee.email });
      }
      
      if (updatedEmployee.address) {
        Object.assign(updateData, { address: updatedEmployee.address });
      }
      
      if (updatedEmployee.comments) {
        Object.assign(updateData, { comments: updatedEmployee.comments });
      }
      
      const { error } = await employeesTable()
        .update(updateData)
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
