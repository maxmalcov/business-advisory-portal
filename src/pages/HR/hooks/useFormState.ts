
import { useState } from 'react';
import { FormValues } from '../components/WorkHoursForm';
import { EmployeeRecord } from '../components/WorkHoursTable';

export function useFormState() {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<FormValues | undefined>(undefined);

  // Start editing a row
  const startEdit = (employee: EmployeeRecord) => {
    setEditingId(employee.id);
    setIsAddingNew(true);
    setCurrentFormValues({
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      grossSalary: employee.grossSalary,
      notes: employee.notes,
      absenceDays: employee.absenceDays,
      medicalLeaveDate: employee.medicalLeaveDate ? new Date(employee.medicalLeaveDate) : null,
    });
  };

  // Cancel form
  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setCurrentFormValues(undefined);
  };

  return {
    isAddingNew,
    setIsAddingNew,
    editingId,
    setEditingId,
    currentFormValues,
    setCurrentFormValues,
    startEdit,
    cancelForm
  };
}
