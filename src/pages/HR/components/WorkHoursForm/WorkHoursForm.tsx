
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Employee } from '../../types/employee';
import { FormValues } from './types';
import FormFields from './FormFields';
import EmployeeSelectionStep from './EmployeeSelectionStep';

interface WorkHoursFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialValues?: FormValues;
  editingId?: string;
  existingEmployees: FormValues[];
}

const WorkHoursForm: React.FC<WorkHoursFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  editingId,
  existingEmployees = [],
}) => {
  const [useEmployeeSelector, setUseEmployeeSelector] = useState(!editingId);
  
  // Initialize form with default values or provided initial values
  const form = useForm<FormValues>({
    defaultValues: {
      id: editingId || undefined,
      employeeId: initialValues?.employeeId || undefined,
      employeeName: initialValues?.employeeName || '',
      companyName: initialValues?.companyName || '',
      grossSalary: initialValues?.grossSalary || 0,
      absenceDays: initialValues?.absenceDays || 0,
      medicalLeaveDate: initialValues?.medicalLeaveDate || null,
      notes: initialValues?.notes || '',
    },
  });

  // Convert form values and submit
  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      id: editingId,
      // Ensure numbers are proper numbers
      grossSalary: Number(data.grossSalary),
      absenceDays: data.absenceDays ? Number(data.absenceDays) : 0,
    });
  };

  const handleSelectEmployee = (employee: Employee | null) => {
    if (employee) {
      // Pre-fill form with employee data
      form.setValue('employeeId', employee.id);
      form.setValue('employeeName', employee.fullName || '');
      form.setValue('companyName', employee.companyName || '');
    }
    
    // After selecting or choosing manual entry, hide the selector
    setUseEmployeeSelector(false);
  };

  // If we're editing, don't show the selector initially
  if (!useEmployeeSelector) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormFields form={form} />

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Update' : 'Add'} Employee
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // Show employee selector first
  return (
    <EmployeeSelectionStep
      existingEmployees={existingEmployees}
      onSelectEmployee={handleSelectEmployee}
      onCancel={onCancel}
    />
  );
};

export default WorkHoursForm;
