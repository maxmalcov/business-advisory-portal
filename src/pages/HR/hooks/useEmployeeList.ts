
import { useState, useEffect, useCallback } from 'react';
import { Employee as EmployeeType, EmployeeStatus, fromDbEmployee } from '../types/employee';
import { employeesTable } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useEmployeeList() {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus>('active');
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  
  const refreshEmployees = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching employees with status filter: ${statusFilter}`);
        // Query the database using the employeesTable helper
        const { data, error } = await employeesTable()
          .select('id, full_name, position, status, start_date, end_date, company_name, dni_tie, id_document, id_document_url, weekly_schedule')
          .eq('status', statusFilter);
          
        if (error) {
          throw error;
        }
        
        console.log('Employee data received:', data);
        
        if (data && Array.isArray(data)) {
          // Transform the data to match our Employee interface using our helper
          const transformedData: EmployeeType[] = data.map(emp => fromDbEmployee(emp));
          
          console.log('Transformed employee data:', transformedData);
          setEmployees(transformedData);
        } else {
          // Handle the case where data is not an array
          setEmployees([]);
          console.warn('Unexpected data format received:', data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Error fetching employees',
          description: 'There was a problem loading the employee list.',
          variant: 'destructive'
        });
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [statusFilter, refreshTrigger, toast]);

  return {
    employees,
    statusFilter,
    setStatusFilter,
    isLoading,
    refreshEmployees
  };
}
