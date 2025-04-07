
import { useState, useEffect, useCallback } from 'react';
import { Employee as EmployeeType, EmployeeStatus } from '../types/employee';
import { employeesTable, Employee } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useEmployeeList() {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus>('active');
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshEmployees = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      
      try {
        // Query the database using the employeesTable helper
        const { data, error } = await employeesTable()
          .select('id, full_name, position, status, start_date, end_date, company_name, dni_tie, id_document, weekly_schedule')
          .eq('status', statusFilter);
          
        if (error) {
          throw error;
        }
        
        if (data && Array.isArray(data)) {
          // Transform the data to match our Employee interface
          const transformedData: EmployeeType[] = data.map((emp: any) => ({
            id: emp.id,
            fullName: emp.full_name,
            position: emp.position,
            status: emp.status as EmployeeStatus,
            startDate: emp.start_date,
            endDate: emp.end_date || undefined,
            companyName: emp.company_name || '',
            dniTie: emp.dni_tie || '',
            idDocument: emp.id_document || '',
            weeklySchedule: emp.weekly_schedule || ''
          }));
          
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [statusFilter, refreshTrigger]);

  return {
    employees,
    statusFilter,
    setStatusFilter,
    isLoading,
    refreshEmployees
  };
}
