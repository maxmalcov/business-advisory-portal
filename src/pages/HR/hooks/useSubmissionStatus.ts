import { useState, useEffect } from 'react';
import { workHoursSubmissionsTable } from '@/integrations/supabase/client';
import { getMonthYearForStorage } from '@/utils/dates';
import { useToast } from '@/hooks/use-toast';
import { WorkHoursSubmission } from './useMonthlySubmissions';

export const useSubmissionStatus = (
  selectedMonth: Date,
  submissions: WorkHoursSubmission[],
) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Check if the selected month is already submitted
  useEffect(() => {
    const formattedSelectedMonth = getMonthYearForStorage(selectedMonth);
    const isMonthSubmitted = !!submissions.find((s) =>
      s.month_year.startsWith(formattedSelectedMonth),
    );
    setIsSubmitted(isMonthSubmitted);
  }, [submissions, selectedMonth]);

  return {
    isSubmitted,
  };
};
