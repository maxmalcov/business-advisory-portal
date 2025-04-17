
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="view">View Hours</TabsTrigger>
        {!isSubmitted && (
          <TabsTrigger value="edit" disabled={isSubmitted}>
            {editingEmployee ? (editingEmployee.id ? 'Edit Employee' : 'Add Employee') : 'Edit Form'}
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="view">
        <WorkHoursTable 
          employeeData={workHours} 
          onEdit={!isSubmitted ? onEditEmployee : undefined}
          onDelete={!isSubmitted ? onDeleteEmployee : undefined}
          loading={loading}
        />
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
          {!isSubmitted && (
            <Button onClick={onAddEmployee} disabled={loading}>
              Add Employee
            </Button>
          )}
          
          {!isSubmitted && workHours.length > 0 && (
            <Button onClick={onSubmitMonth} className="sm:ml-auto" disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              Submit {formatMonthYear(selectedMonth)}
            </Button>
          )}
        </div>
      </TabsContent>
      
      {!isSubmitted && (
        <TabsContent value="edit">
          {editingEmployee && (
            <WorkHoursForm 
              onSubmit={onSubmitForm}
              editingId={editingEmployee.id}
              initialValues={editingEmployee}
              onCancel={onCancelEdit}
              existingEmployees={workHours}
            />
          )}
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MonthlySubmissionsTabs;
