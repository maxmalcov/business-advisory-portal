import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { EmployeeData } from '../types';
import {useAuth} from "@/context/AuthContext.tsx";

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const {user} = useAuth()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await employeesTable()
          .select('id, full_name, position, start_date')
          .eq('status', 'active')
            .eq('user_id', user.id);

        if (error) throw error;

        if (data && Array.isArray(data)) {
          const transformedData: EmployeeData[] = data.map((emp: any) => ({
            id: emp.id,
            name: emp.full_name,
            position: emp.position,
            startDate: new Date(emp.start_date),
            vacationDaysTotal: 23,
            vacationDaysUsed: Math.floor(Math.random() * 20),
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
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  return {
    employees,
    isLoading,
  };
};
