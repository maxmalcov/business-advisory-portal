
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
    const fetchUserStats = async () => {
      try {
        // Note: In a real application, this would query 'users' or 'profiles' instead of 'employees'
        const { data: users, error: userError } = await supabase
          .from('profiles')
          .select('*');
        
        if (userError) throw userError;
        
        if (users) {
          const active = users.filter(user => user.usertype === 'client');
          
          // Users added in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAdded = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate >= thirtyDaysAgo;
          });
          
          setEmployeeStats({
            total: users.length,
            active: active.length,
            terminated: users.length - active.length,
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
          total: 15,
          active: 12,
          terminated: 3,
          recentlyAdded: 2,
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
    
    fetchUserStats();
  }, [toast]);

  return {
    employeeStats,
    loading,
    error
  };
};
