
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MonthlySubmissionsHeader from './MonthlySubmissionsHeader';
import WorkHoursTable from '../WorkHoursTable';
import ActionSection from './ActionSection';
import FormSection from './FormSection';
import { WorkHoursData } from '../../hooks/useEmployeeWorkHours';
import { useMonthlySubmissions } from './MonthlySubmissionsContext';

interface MonthlySubmissionsContentProps {
  selectedMonth: Date;
  isSubmitted: boolean;
  workHours: WorkHoursData[];
  loading: boolean;
  onDeleteEmployee: (id: string) => void;
  onSubmitForm: (values: WorkHoursData) => Promise<void>;
  onSubmitMonth: () => void;
}

const MonthlySubmissionsContent: React.FC<MonthlySubmissionsContentProps> = ({
  selectedMonth,
  isSubmitted,
  workHours,
  loading,
  onDeleteEmployee,
  onSubmitForm,
  onSubmitMonth,
}) => {
  const { handleEditEmployee } = useMonthlySubmissions();

  return (
    <Card>
      <MonthlySubmissionsHeader
        selectedMonth={selectedMonth}
        isSubmitted={isSubmitted}
      />
      
      <CardContent>
        <WorkHoursTable 
          employeeData={workHours} 
          onEdit={!isSubmitted ? handleEditEmployee : undefined}
          onDelete={!isSubmitted ? onDeleteEmployee : undefined}
          loading={loading}
        />
        
        <ActionSection
          isSubmitted={isSubmitted}
          workHours={workHours}
          selectedMonth={selectedMonth}
          loading={loading}
          onSubmitMonth={onSubmitMonth}
        />
        
        <FormSection
          isSubmitted={isSubmitted}
          workHours={workHours}
          onSubmitForm={onSubmitForm}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlySubmissionsContent;
