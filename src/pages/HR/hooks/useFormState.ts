
import { useState } from 'react';
import { FormValues } from '../components/WorkHoursForm';

export const useFormState = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [currentFormValues, setCurrentFormValues] = useState<FormValues | null>(null);

  const startEdit = (employee: FormValues) => {
    setIsAddingNew(false);
    setEditingId(employee.id);
    setCurrentFormValues(employee);
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingId(undefined);
    setCurrentFormValues(null);
  };

  return {
    isAddingNew,
    setIsAddingNew,
    editingId,
    currentFormValues,
    startEdit,
    cancelForm
  };
};
