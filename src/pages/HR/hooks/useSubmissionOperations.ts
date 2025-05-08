import { useToast } from '@/hooks/use-toast';
import { isAfter, startOfMonth } from 'date-fns';
import {notificationSettingsTable, workHoursSubmissionsTable} from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import {useAuth} from "@/context/AuthContext.tsx";
import axios from 'axios';
import {log} from "@/utils/logs/log.funciton.ts";

export const useSubmissionOperations = (
  selectedMonth: Date,
  refreshSubmissions: () => Promise<void>
) => {
  const { toast } = useToast();
  const {user} = useAuth()
  
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
        client_id: user.id,
      });
      
      if (error) throw error;

      const { data , error: settingsError } = await notificationSettingsTable()
          .select('email')
          .eq('category', 'hr_payroll')
          .maybeSingle();

      if(settingsError){
        throw new Error(`Get notification settings error: ${error}`)
      }

      const payload = {
        to: (data as any).email,
        subject: `Monthly Work Report Submitted: ${selectedMonth.toLocaleString('en-US', { month: 'long' })}`,
        date: formattedMonth
      };

      axios.post('http://localhost:3001/v1/work-hours', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      log({ action: "Report", description: "Monthly work hours report sent to HR", user: user.email, level: 'info', category: "Employee"})
      
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
