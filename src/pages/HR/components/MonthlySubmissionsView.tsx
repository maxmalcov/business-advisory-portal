
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatMonthYear } from '@/utils/dates';
import { CalendarCheck, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

import MonthSelector from './MonthSelector';
import { useMonthlySubmissions } from '../hooks/useMonthlySubmissions';
import { useEmployeeWorkHours, WorkHoursData } from '../hooks/useEmployeeWorkHours';
import WorkHoursTable from './WorkHoursTable';
import WorkHoursForm from './WorkHoursForm';

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
  const [activeTab, setActiveTab] = useState<string>('view');
  const [editingEmployee, setEditingEmployee] = useState<WorkHoursData | null>(null);
  
  const { 
    months, 
    selectedMonth, 
    setSelectedMonth,
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

  const handleSelectMonth = (month: Date) => {
    setSelectedMonth(month);
    setEditingEmployee(null);
    setActiveTab('view');
  };

  const handleEditEmployee = (employee: WorkHoursData) => {
    setEditingEmployee(employee);
    setActiveTab('edit');
  };

  const handleAddEmployee = () => {
    setEditingEmployee({
      employeeName: '',
      grossSalary: 0,
    });
    setActiveTab('edit');
    setIsAddingNew(true);
  };

  const handleSubmitForm = async (values: WorkHoursData) => {
    const success = await saveEmployee(values);
    if (success) {
      toast({
        title: 'Success',
        description: `Employee ${values.id ? 'updated' : 'added'} successfully.`,
      });
      setEditingEmployee(null);
      setActiveTab('view');
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
      />
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="flex items-center text-xl">
            <CalendarCheck className="mr-2 h-5 w-5" />
            {formatMonthYear(selectedMonth)}
            {isSubmitted && (
              <Badge variant="outline" className="ml-3 bg-green-50 border-green-200 text-green-700">
                Submitted
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
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
                onEdit={!isSubmitted ? handleEditEmployee : undefined}
                onDelete={!isSubmitted ? handleDeleteEmployee : undefined}
                loading={loading}
              />
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                {!isSubmitted && (
                  <Button onClick={handleAddEmployee} disabled={loading}>
                    Add Employee
                  </Button>
                )}
                
                {!isSubmitted && workHours.length > 0 && (
                  <Button onClick={handleSubmitMonth} className="sm:ml-auto" disabled={loading}>
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
                    onSubmit={handleSubmitForm}
                    editingId={editingEmployee.id}
                    initialValues={editingEmployee}
                    onCancel={() => {
                      setEditingEmployee(null);
                      setActiveTab('view');
                      setIsAddingNew(false);
                    }}
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySubmissionsView;
