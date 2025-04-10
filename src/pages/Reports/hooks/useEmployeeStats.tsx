
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeStats } from './types';

export const useEmployeeStats = () => {
  const { toast } = useToast();
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats>({
    total: 0,
    active: 0,
    terminated: 0,
    recentlyAdded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const { data: employees, error: employeeError } = await supabase
          .from('employees')
          .select('*');
        
        if (employeeError) throw employeeError;
        
        if (employees) {
          const active = employees.filter(emp => emp.status === 'active');
          const terminated = employees.filter(emp => emp.status === 'terminated');
          
          // Employees added in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAdded = employees.filter(emp => {
            const empDate = new Date(emp.created_at);
            return empDate >= thirtyDaysAgo;
          });
          
          setEmployeeStats({
            total: employees.length,
            active: active.length,
            terminated: terminated.length,
            recentlyAdded: recentlyAdded.length,
          });
        } else {
          // Use default values if no data returned
          setEmployeeStats({
            total: 0,
            active: 0,
            terminated: 0,
            recentlyAdded: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching employee stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching employee stats'));
        
        // Use mock data as fallback
        setEmployeeStats({
          total: 15,
          active: 12,
          terminated: 3,
          recentlyAdded: 2,
        });
        
        toast({
          variant: "destructive",
          title: "Error loading employee data",
          description: "There was a problem loading your employee data. Using mock data instead.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeStats();
  }, [toast]);

  return {
    employeeStats,
    loading,
    error
  };
};
