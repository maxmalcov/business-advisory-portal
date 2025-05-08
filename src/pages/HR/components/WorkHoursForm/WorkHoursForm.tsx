
import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Employee } from '../../types/employee';
import { FormValues } from './types';
import FormFields from './FormFields';
import EmployeeSelector from "@/pages/HR/Termination/components/EmployeeSelector.tsx";
import {useEmployeeData} from "@/pages/HR/Termination/hooks/useEmployeeData.ts";
import { employeeWorkHoursTable } from '@/integrations/supabase/client';
import {useAuth} from "@/context/AuthContext.tsx";
import {toast} from "@/hooks/use-toast.ts";
import {
  Dialog,
} from "@/components/ui/dialog";

interface WorkHoursFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialValues?: FormValues;
  editingId?: string;
  existingEmployees: FormValues[];
  selectedMonth: Date
}

const WorkHoursForm: React.FC<WorkHoursFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  editingId,
  selectedMonth,
  existingEmployees = [],
}) => {
  const [useEmployeeSelector, setUseEmployeeSelector] = useState(!editingId);
  const { employees, isLoading } = useEmployeeData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const {user} = useAuth()
  
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

  useEffect(() => {
    form.reset({id: editingId || undefined,
      employeeId: initialValues?.employeeId || undefined,
      employeeName: initialValues?.employeeName || '',
      companyName: initialValues?.companyName || '',
      grossSalary: initialValues?.grossSalary || 0,
      absenceDays: initialValues?.absenceDays || 0,
      medicalLeaveDate: initialValues?.medicalLeaveDate || null,
      notes: initialValues?.notes || '',})
  }, [initialValues])

  // Convert form values and submit
  const handleSubmit = async (data: FormValues) => {
      const { error } = editingId ? await employeeWorkHoursTable().update({
        employee_name: data.employeeName,
        gross_salary: data.grossSalary,
        company_name: data.companyName,
        absence_days: data.absenceDays,
        medical_leave_date: data.medicalLeaveDate,
        notes: data.notes
      }).eq('id', editingId) :  await employeeWorkHoursTable().insert({
        client_id: user.id,
        employee_name: data.employeeName,
        gross_salary: data.grossSalary,
        month_year: `${selectedMonth.getFullYear()}-0${selectedMonth.getMonth()+1}`,
        employee_id: selectedEmployee,
        company_name: data.companyName,
        absence_days: data.absenceDays,
        medical_leave_date: data.medicalLeaveDate,
        notes: data.notes
      })

     if(error){
       console.error(error)
       toast({
         title: 'Failed',
         description: 'Form wasn\'t submitted',
         variant: 'destructive'
       })
       return
     }

     toast({
       title: 'Success',
       description: 'Form submitted successfully'
     })
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
  // Show employee selector first
  return (
      <div className="space-y-6">
        {!editingId && <EmployeeSelector
            employees={employees}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
        />}
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
      </div>
  );
};

export default WorkHoursForm;
