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
    registrationTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        // Fetch user data from profiles table instead of employees
        const { data: users, error: userError } = await supabase
          .from('employees')
          .select('*');

        if (userError) throw userError;

        if (users) {
          // Determine active users (those with non-null usertype)
          const active = users.filter((user) => user.status != 'terminated');

          // Users registered in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const recentlyAdded = users.filter((user) => {
            const userDate = new Date(user.created_at);
            return userDate >= thirtyDaysAgo;
          });

          // Generate registration trends data (last 90 days)
          const registrationTrends = generateRegistrationTrends(users, 90);

          setEmployeeStats({
            total: users.length,
            active: active.length,
            terminated: 0, // Not applicable for users, keeping for compatibility
            recentlyAdded: recentlyAdded.length,
            registrationTrends,
          });
        } else {
          // Use default values if no data returned
          setEmployeeStats({
            total: 0,
            active: 0,
            terminated: 0,
            recentlyAdded: 0,
            registrationTrends: [],
          });
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Unknown error fetching user stats'),
        );

        // Use mock data as fallback
        setEmployeeStats({
          total: 45,
          active: 42,
          terminated: 0,
          recentlyAdded: 8,
          registrationTrends: generateMockRegistrationTrends(90),
        });

        toast({
          variant: 'destructive',
          title: 'Error loading user data',
          description:
            'There was a problem loading your user data. Using mock data instead.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, [toast]);

  // Generate registration trends from user data
  const generateRegistrationTrends = (users: any[], days: number) => {
    const trends: { date: string; count: number }[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    // Create a map to hold counts per day
    const dateMap = new Map<string, number>();

    // Initialize all dates in range with 0 count
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = formatDate(date);
      dateMap.set(dateStr, 0);
    }

    // Count registrations per day
    users.forEach((user) => {
      const registrationDate = new Date(user.created_at);
      if (registrationDate >= startDate && registrationDate <= today) {
        const dateStr = formatDate(registrationDate);
        const currentCount = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, currentCount + 1);
      }
    });

    // Convert map to array of objects
    dateMap.forEach((count, date) => {
      trends.push({ date, count });
    });

    // Sort by date
    trends.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return trends;
  };

  // Generate mock registration trends for fallback
  const generateMockRegistrationTrends = (days: number) => {
    const trends: { date: string; count: number }[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = formatDate(date);
      // Generate random count between 0 and 5
      const count = Math.floor(Math.random() * 6);
      trends.push({ date: dateStr, count });
    }

    return trends;
  };

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    employeeStats,
    loading,
    error,
  };
};
