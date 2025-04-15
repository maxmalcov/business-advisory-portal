
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
        let query = employeesTable()
          .select('id, full_name, position, start_date')
          .eq('status', 'active');
        
        // If not admin, filter by company name
        if (user && user.userType !== 'admin' && user.companyName) {
          query = query.eq('company_name', user.companyName);
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
