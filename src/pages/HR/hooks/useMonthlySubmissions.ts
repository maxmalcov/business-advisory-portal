
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  employeeWorkHoursTable, 
  workHoursSubmissionsTable
} from '@/integrations/supabase/client';
import { getMonthYearForStorage, getCurrentMonthYear, getLastMonths } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';

export type SubmissionStatus = 'submitted' | 'pending';

export type MonthSubmission = {
  date: Date;
  status: SubmissionStatus;
  isCurrentMonth: boolean;
  submission?: any;
};

// Define a simpler type for WorkHoursSubmission
export type WorkHoursSubmission = {
  id: string;
  client_id: string;
  month_year: string;
  submitted_at: string;
  hr_email: string | null;
  is_locked: boolean;
};

export const useMonthlySubmissions = (monthCount: number = 6) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<WorkHoursSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<MonthSubmission[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(getCurrentMonthYear());
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      // First to unknown, then to the expected type
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

  // Process the submissions data to create a month list
  useEffect(() => {
    if (!user?.id) return;

    const lastMonths = getLastMonths(monthCount);
    const currentMonth = getCurrentMonthYear().toISOString();
    
    const monthsWithStatus: MonthSubmission[] = lastMonths.map(date => {
      const monthStr = getMonthYearForStorage(date);
      const submission = submissions.find(s => s.month_year.startsWith(monthStr));
      const isCurrentMonthDate = date.toISOString().split('T')[0] === currentMonth.split('T')[0];
      
      return {
        date,
        status: submission ? 'submitted' : 'pending',
        isCurrentMonth: isCurrentMonthDate,
        submission,
      };
    });
    
    setMonths(monthsWithStatus);
    
    // Check if the selected month is submitted
    const formattedSelectedMonth = getMonthYearForStorage(selectedMonth);
    const isMonthSubmitted = !!submissions.find(s => 
      s.month_year.startsWith(formattedSelectedMonth)
    );
    setIsSubmitted(isMonthSubmitted);
  }, [submissions, user?.id, selectedMonth, monthCount]);

  // When the component initializes, fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, [user?.id]);

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
      await fetchSubmissions();
      
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

  const updateHrEmail = async (email: string) => {
    if (!user?.id || !selectedMonth) return false;
    
    try {
      const formattedMonth = getMonthYearForStorage(selectedMonth);
      const submission = submissions.find(s => s.month_year.startsWith(formattedMonth));
      
      if (submission) {
        await workHoursSubmissionsTable()
          .update({ hr_email: email })
          .eq('id', submission.id);
      }
      
      // Refresh the submissions data
      await fetchSubmissions();
      return true;
    } catch (error) {
      console.error('Error updating HR email:', error);
      return false;
    }
  };

  return {
    months,
    selectedMonth,
    setSelectedMonth,
    isSubmitted,
    loading,
    submitMonth,
    updateHrEmail,
    refreshSubmissions: fetchSubmissions,
  };
};

export default useMonthlySubmissions;
