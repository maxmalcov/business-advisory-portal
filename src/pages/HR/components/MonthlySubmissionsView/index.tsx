import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { isAfter, startOfMonth } from 'date-fns';

import MonthSelector from '../MonthSelector';
import { useMonthlySubmissions as useMonthlySubmissionsData } from '../../hooks/useMonthlySubmissions';
import { useEmployeeWorkHours } from '../../hooks/useEmployeeWorkHours';
import { MonthlySubmissionsProvider } from './MonthlySubmissionsContext';
import MonthlySubmissionsContent from './MonthlySubmissionsContent';

interface MonthlySubmissionsViewProps {
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
  months;
  selectedMonth;
  setSelectedMonth;
  selectedYear;
  onYearChange;
  onNavigateMonth;
  isSubmitted;
  submissionsLoading;
  submitMonth;
}

const MonthlySubmissionsView: React.FC<MonthlySubmissionsViewProps> = ({
  isAddingNew,
  setIsAddingNew,
  months,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  onYearChange,
  onNavigateMonth,
  isSubmitted,
  submissionsLoading,
  submitMonth,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    workHours,
    loading: workHoursLoading,
    saveEmployee,
    deleteEmployee,
  } = useEmployeeWorkHours(selectedMonth, isSubmitted);

  const handleSelectMonth = (month: Date) => {
    const today = new Date();
    if (isAfter(startOfMonth(month), startOfMonth(today))) {
      toast({
        title: 'Future month not allowed',
        description: 'You can only view and edit current or past months.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedMonth(month);
  };

  const handleSubmitForm = async (values: any) => {
    const today = new Date();
    if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
      toast({
        title: 'Future month not allowed',
        description: 'You cannot save data for future months.',
        variant: 'destructive',
      });
      return;
    }

    const success = await saveEmployee(values);
    if (success) {
      toast({
        title: 'Success',
        description: `Employee ${values.id ? 'updated' : 'added'} successfully.`,
      });
      setIsAddingNew(false);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save employee data.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!id) return;

    const success = await deleteEmployee(id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Employee removed successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to remove employee.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitMonth = async () => {
    const hrEmail = user?.outgoingInvoiceEmail || '';

    const success = await submitMonth(hrEmail);
    if (success) {
      toast({
        title: 'Success',
        description: 'Month submitted successfully.',
      });
    }
  };

  const loading = submissionsLoading || workHoursLoading;

  return (
    <div className="space-y-6">
      <MonthSelector
        months={months}
        selectedMonth={selectedMonth}
        onSelectMonth={handleSelectMonth}
        loading={submissionsLoading}
        onYearChange={onYearChange}
        selectedYear={selectedYear}
        onNavigateMonth={onNavigateMonth}
      />

      <MonthlySubmissionsProvider
        isAddingNew={isAddingNew}
        setIsAddingNew={setIsAddingNew}
      >
        <MonthlySubmissionsContent
          selectedMonth={selectedMonth}
          isSubmitted={isSubmitted}
          workHours={workHours}
          loading={loading}
          onDeleteEmployee={handleDeleteEmployee}
          onSubmitForm={handleSubmitForm}
          onSubmitMonth={handleSubmitMonth}
        />
      </MonthlySubmissionsProvider>
    </div>
  );
};

export default MonthlySubmissionsView;
