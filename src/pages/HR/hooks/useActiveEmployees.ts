
import { useState, useEffect } from 'react';
import { employeesTable } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '../types/employee';

// Define the type for raw employee data from Supabase
interface EmployeeData {
  id: string;
  full_name: string;
  position: string;
  company_name: string | null;
}

export function useActiveEmployees() {
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActiveEmployees = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await employeesTable()
          .select('id, full_name, position, company_name')
          .eq('status', 'active')
          .order('full_name');
          
        if (error) {
          throw error;
        }
        
        // Make sure data is always an array (even if undefined or null)
        const employeeData = Array.isArray(data) ? (data as unknown as EmployeeData[]) : [];
          
        const transformedData: Employee[] = employeeData.map((emp) => ({
          id: emp.id,
          fullName: emp.full_name,
          position: emp.position,
          status: 'active',
          startDate: '', // These fields are not needed for the dropdown
          companyName: emp.company_name || '',
        }));
          
        setActiveEmployees(transformedData);
      } catch (error) {
        console.error('Error fetching active employees:', error);
        toast({
          title: 'Error fetching employees',
          description: 'Could not load the employee list.',
          variant: 'destructive'
        });
        setActiveEmployees([]); // Always set as empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActiveEmployees();
  }, [toast]);

  return {
    activeEmployees,
    isLoading
  };
}
