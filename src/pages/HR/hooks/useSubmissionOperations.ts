
import { useAuth } from '@/context/AuthContext';
import { workHoursSubmissionsTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';

export const useSubmissionOperations = (
  selectedMonth: Date,
  refreshSubmissions: () => Promise<void>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Submit month's work hours
  const submitMonth = async (hrEmail: string | null = null) => {
    if (!user?.id) return false;
    
    try {
      const formattedMonth = getMonthYearForStorage(selectedMonth);
      
      const { data, error } = await workHoursSubmissionsTable().insert({
        client_id: user.id,
        month_year: formattedMonth,
        hr_email: hrEmail,
        is_locked: true,
      });
      
      if (error) throw error;
      
      // Refresh the submissions data
      await refreshSubmissions();
      
      toast({
        title: 'Submission successful',
        description: 'Your work hours have been submitted successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting month:', error);
      toast({
        title: 'Submission failed',
        description: 'An error occurred while submitting your work hours.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    submitMonth
  };
};
