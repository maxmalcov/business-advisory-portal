
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MonthlySubmissionsHeader from './MonthlySubmissionsHeader';
import { InlineWorkHoursTable } from '../InlineWorkHoursTable';
import ActionSection from './ActionSection';
import { WorkHoursData } from '../../hooks/useEmployeeWorkHours';

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
  return (
    <Card>
      <MonthlySubmissionsHeader
        selectedMonth={selectedMonth}
        isSubmitted={isSubmitted}
      />
      
      <CardContent>
        <InlineWorkHoursTable 
          employeeData={workHours} 
          onSave={onSubmitForm}
          onDelete={onDelete}
          loading={loading}
          isSubmitted={isSubmitted}
        />
        
        <ActionSection
          isSubmitted={isSubmitted}
          workHours={workHours}
          selectedMonth={selectedMonth}
          loading={loading}
          onSubmitMonth={onSubmitMonth}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlySubmissionsContent;
