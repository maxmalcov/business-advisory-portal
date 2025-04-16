
import { useState, useEffect, useCallback } from 'react';
import { Employee as EmployeeType, EmployeeStatus } from '../types/employee';
import { employeesTable } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useEmployeeList() {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
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
        
        // Initialize query
        let query = employeesTable()
          .select('id, full_name, position, status, start_date, end_date, company_name, dni_tie, id_document, weekly_schedule');
          
        // Only apply status filter if not 'all'
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
          
        if (error) {
          throw error;
        }
        
        console.log('Employee data received:', data);
        
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
