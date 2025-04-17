
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { isAfter, startOfMonth } from 'date-fns';

import MonthSelector from '../MonthSelector';
import MonthlySubmissionsHeader from './MonthlySubmissionsHeader';
import MonthlySubmissionsTabs from './MonthlySubmissionsTabs';
import { useMonthlySubmissions } from '../../hooks/useMonthlySubmissions';
import { useEmployeeWorkHours, WorkHoursData } from '../../hooks/useEmployeeWorkHours';

interface MonthlySubmissionsViewProps {
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
}

const MonthlySubmissionsView: React.FC<MonthlySubmissionsViewProps> = ({
  isAddingNew,
  setIsAddingNew,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingEmployee, setEditingEmployee] = useState<WorkHoursData | null>(null);
  
  const { 
    months, 
    selectedMonth, 
    setSelectedMonth,
    selectedYear,
    onYearChange,
    onNavigateMonth,
    isSubmitted,
    loading: submissionsLoading,
    submitMonth 
  } = useMonthlySubmissions();
  
  const {
    workHours,
    loading: workHoursLoading,
    saveEmployee,
    deleteEmployee,
  } = useEmployeeWorkHours(selectedMonth, isSubmitted);

  useEffect(() => {
    const today = new Date();
    if (selectedMonth && isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
      const availableMonths = months
        .filter(month => !month.isFutureMonth)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      if (availableMonths.length > 0) {
        setSelectedMonth(availableMonths[0].date);
        toast({
          title: "Future month not allowed",
          description: "You can only view and edit current or past months.",
        });
      }
    }
  }, [selectedMonth, months, setSelectedMonth]);

  const handleSelectMonth = (month: Date) => {
    const today = new Date();
    if (isAfter(startOfMonth(month), startOfMonth(today))) {
      toast({
        title: "Future month not allowed",
        description: "You can only view and edit current or past months.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedMonth(month);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: WorkHoursData) => {
    setEditingEmployee(employee);
  };

  const handleAddEmployee = () => {
    const today = new Date();
    if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
      toast({
        title: "Future month not allowed",
        description: "You cannot add employees to future months.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingEmployee({
      employeeName: '',
      grossSalary: 0,
    });
    setIsAddingNew(true);
  };

  const handleSubmitForm = async (values: WorkHoursData) => {
    const today = new Date();
    if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
      toast({
        title: "Future month not allowed",
        description: "You cannot save data for future months.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await saveEmployee(values);
    if (success) {
      toast({
        title: 'Success',
        description: `Employee ${values.id ? 'updated' : 'added'} successfully.`,
      });
      setEditingEmployee(null);
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

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setIsAddingNew(false);
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
      
      <Card>
        <MonthlySubmissionsHeader 
          selectedMonth={selectedMonth}
          isSubmitted={isSubmitted}
        />
        
        <CardContent>
          <MonthlySubmissionsTabs
            editingEmployee={editingEmployee}
            workHours={workHours}
            isSubmitted={isSubmitted}
            loading={loading}
            selectedMonth={selectedMonth}
            onAddEmployee={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onSubmitForm={handleSubmitForm}
            onSubmitMonth={handleSubmitMonth}
            onCancelEdit={handleCancelEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySubmissionsView;
