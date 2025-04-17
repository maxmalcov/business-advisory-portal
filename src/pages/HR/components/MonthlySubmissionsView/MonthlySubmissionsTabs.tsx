
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { formatMonthYear } from '@/utils/dates';
import { WorkHoursData } from '../../hooks/useEmployeeWorkHours';
import WorkHoursTable from '../WorkHoursTable';
import WorkHoursForm from '../WorkHoursForm';

interface MonthlySubmissionsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  editingEmployee: WorkHoursData | null;
  workHours: WorkHoursData[];
  isSubmitted: boolean;
  loading: boolean;
  selectedMonth: Date;
  onAddEmployee: () => void;
  onEditEmployee: (employee: WorkHoursData) => void;
  onDeleteEmployee: (id: string) => void;
  onSubmitForm: (values: WorkHoursData) => Promise<void>;
  onSubmitMonth: () => void;
  onCancelEdit: () => void;
}

const MonthlySubmissionsTabs: React.FC<MonthlySubmissionsTabsProps> = ({
  activeTab,
  setActiveTab,
  editingEmployee,
  workHours,
  isSubmitted,
  loading,
  selectedMonth,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onSubmitForm,
  onSubmitMonth,
  onCancelEdit
}) => {
  return (
    <div className="mt-6">
      {activeTab === 'view' && (
        <div>
          <WorkHoursTable 
            employeeData={workHours} 
            onEdit={!isSubmitted ? onEditEmployee : undefined}
            onDelete={!isSubmitted ? onDeleteEmployee : undefined}
            loading={loading}
          />
          
          {!isSubmitted && workHours.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button onClick={onSubmitMonth} disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                Submit {formatMonthYear(selectedMonth)}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'edit' && !isSubmitted && editingEmployee && (
        <WorkHoursForm 
          onSubmit={onSubmitForm}
          editingId={editingEmployee.id}
          initialValues={editingEmployee}
          onCancel={onCancelEdit}
          existingEmployees={workHours}
        />
      )}
    </div>
  );
};

export default MonthlySubmissionsTabs;
