
import { useState, useEffect } from 'react';
import {ActivityEvent, getRecentActivity} from '@/utils/activity';
import { useToast } from '@/hooks/use-toast';
import {logsTable} from "@/integrations/supabase/client.ts";

export const useActivityData = () => {
  const { toast } = useToast();
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setActivityData(await getRecentActivity());
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching activity data'));
        
        setActivityData(await getRecentActivity());
        
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
