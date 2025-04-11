
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
        // Fetch user data from profiles table instead of employees
        const { data: users, error: userError } = await supabase
          .from('profiles')
          .select('*');
        
        if (userError) throw userError;
        
        if (users) {
          // Determine active users (those with non-null usertype)
          const active = users.filter(user => user.usertype !== null);
          
          // Users registered in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAdded = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate >= thirtyDaysAgo;
          });
          
          setEmployeeStats({
            total: users.length,
            active: active.length,
            terminated: 0, // Not applicable for users, keeping for compatibility
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
        console.error('Error fetching user stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching user stats'));
        
        // Use mock data as fallback
        setEmployeeStats({
          total: 45,
          active: 42,
          terminated: 0,
          recentlyAdded: 8,
        });
        
        toast({
          variant: "destructive",
          title: "Error loading user data",
          description: "There was a problem loading your user data. Using mock data instead.",
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
