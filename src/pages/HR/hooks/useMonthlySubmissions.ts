import { useSubmissionsFetcher } from './useSubmissionsFetcher';
import { useMonthsProcessor } from './useMonthsProcessor';
import { useSubmissionStatus } from './useSubmissionStatus';
import { useSubmissionOperations } from './useSubmissionOperations';

export type SubmissionStatus = 'submitted' | 'pending';

export type MonthSubmission = {
  date: Date;
  status: SubmissionStatus;
  isCurrentMonth: boolean;
  isFutureMonth?: boolean;
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

export const useMonthlySubmissions = (monthCount: number = 3) => {
  // Fetch all submissions
  const { submissions, loading, refreshSubmissions } = useSubmissionsFetcher();

  // Process months based on submissions
  const {
    months,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    handleYearChange,
    handleNavigateMonth,
  } = useMonthsProcessor(submissions, monthCount);

  // Check if current month is submitted
  const { isSubmitted } = useSubmissionStatus(selectedMonth, submissions);

  // Operations for submitting months
  const { submitMonth } = useSubmissionOperations(
    selectedMonth,
    refreshSubmissions,
  );

  return {
    months,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    onYearChange: handleYearChange,
    onNavigateMonth: handleNavigateMonth,
    isSubmitted,
    loading,
    submitMonth,
    refreshSubmissions,
  };
};

export default useMonthlySubmissions;
