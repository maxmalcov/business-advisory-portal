
import { useState, useEffect } from 'react';
import { ActivityEvent, getMockRecentActivity, getRecentActivity } from '@/utils/activity';
import { useToast } from '@/hooks/use-toast';

export const useActivityData = () => {
  const { toast } = useToast();
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityEvents = await getRecentActivity();
        setActivityData(activityEvents);
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching activity data'));
        
        // Use mock data as fallback
        setActivityData(getMockRecentActivity());
        
        toast({
          variant: "destructive",
          title: "Error loading activity data",
          description: "There was a problem loading your activity data. Using mock data instead.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [toast]);

  return {
    activityData,
    loading,
    error
  };
};
