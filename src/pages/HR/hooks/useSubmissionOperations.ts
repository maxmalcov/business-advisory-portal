
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isAfter, startOfMonth } from 'date-fns';
import { workHoursSubmissionsTable, supabase } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';

export const useSubmissionOperations = (
  selectedMonth: Date,
  refreshSubmissions: () => Promise<void>
) => {
  const { toast } = useToast();
  
  // Submit month's work hours
  const submitMonth = async (hrEmail: string | null = null, workHoursData: any[] = []) => {
    try {
      // Prevent submissions for future months
      const today = new Date();
      if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
        toast({
          title: 'Submission blocked',
          description: 'You cannot submit data for future months.',
          variant: 'destructive',
        });
        return false;
      }
      
      const formattedMonth = getMonthYearForStorage(selectedMonth);
      
      const { error } = await workHoursSubmissionsTable().insert({
        month_year: formattedMonth,
        hr_email: hrEmail,
        is_locked: true,
      });
      
      if (error) throw error;
      
      // Send email notification to admin
      const { error: emailError } = await supabase.functions.invoke('notify-admin-work-hours', {
        body: {
          monthYear: selectedMonth,
          employees: workHoursData,
        },
      });

      if (emailError) {
        console.error('Error sending work hours notification:', emailError);
        toast({
          title: 'Warning',
          description: 'Work hours submitted but admin notification failed',
          variant: 'destructive',
        });
      }
      
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
