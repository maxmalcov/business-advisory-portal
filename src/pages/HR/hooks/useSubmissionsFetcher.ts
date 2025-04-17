
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { workHoursSubmissionsTable } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WorkHoursSubmission } from './useMonthlySubmissions';

export const useSubmissionsFetcher = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<WorkHoursSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all submissions for the user
  const fetchSubmissions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await workHoursSubmissionsTable()
        .select('*')
        .eq('client_id', user.id)
        .order('month_year', { ascending: false });
      
      if (error) throw error;

      // Use a double assertion to safely cast the data
      const typedData = (data as unknown as WorkHoursSubmission[]) || [];
      setSubmissions(typedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Failed to load submissions',
        description: 'An error occurred while fetching your work hours submissions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // When the component initializes, fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, [user?.id]);

  return {
    submissions,
    loading,
    refreshSubmissions: fetchSubmissions
  };
};
