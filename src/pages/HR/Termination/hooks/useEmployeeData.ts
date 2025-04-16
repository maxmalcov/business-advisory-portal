
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { EmployeeData } from '../types';
import { useAuth } from '@/context/AuthContext';

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Create query with active status filter
        let query = employeesTable()
          .select('id, full_name, position, start_date')
          .eq('status', 'active');
        
        // If not admin, strictly filter by company name
        if (user && user.userType !== 'admin') {
          console.log('Filtering termination employees by company:', user.companyName);
          
          // Only show employees from user's company, if companyName is null/undefined, show no employees
          if (user.companyName) {
            query = query.eq('company_name', user.companyName);
          } else {
            // Use a non-existent ID to return no results when user has no company
            query = query.eq('id', 'no-company-assigned');
            console.warn('User has no company assigned, showing no employees');
          }
        }
          
        const { data, error } = await query;
          
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          const transformedData: EmployeeData[] = data.map((emp: any) => ({
            id: emp.id,
            name: emp.full_name,
            position: emp.position,
            startDate: new Date(emp.start_date),
            vacationDaysTotal: 23,
            vacationDaysUsed: Math.floor(Math.random() * 20)
          }));
          
          console.log('Transformed employee data for termination:', transformedData);
          setEmployees(transformedData);
        } else {
          setEmployees([]);
          console.warn('Unexpected data format received:', data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Error',
          description: 'Failed to load employee data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, [toast, user]);

  return {
    employees,
    isLoading
  };
};
