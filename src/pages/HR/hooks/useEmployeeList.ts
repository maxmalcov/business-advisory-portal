
import { useState, useEffect } from 'react';
import { Employee as EmployeeType, EmployeeStatus } from '../types/employee';
import { employeesTable } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useEmployeeList() {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus>('active');
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await employeesTable()
          .select('id, full_name, position, status, start_date, end_date')
          .eq('status', statusFilter);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our Employee interface
          const transformedData: EmployeeType[] = data.map(emp => ({
            id: emp.id,
            fullName: emp.full_name,
            position: emp.position,
            status: emp.status as EmployeeStatus,
            startDate: emp.start_date,
            endDate: emp.end_date || undefined
          }));
          
          setEmployees(transformedData);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Error fetching employees',
          description: 'There was a problem loading the employee list.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [statusFilter]);

  return {
    employees,
    statusFilter,
    setStatusFilter,
    isLoading
  };
}
