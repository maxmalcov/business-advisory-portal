import React, { useState } from 'react';
import { format } from 'date-fns';
import { Employee, EmployeeStatus } from '../types/employee';

interface FormErrors {
  fullName?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
}

export function useEmployeeForm(
  employee: Employee,
  onSave: (updatedEmployee: Employee) => void,
) {
  const [formData, setFormData] = useState<Employee>({
    ...employee,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;

    setFormData((prev) => ({
      ...prev,
      startDate: format(date, 'yyyy-MM-dd'),
    }));

    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }

    // Check if end date is before the new start date and set error if needed
    if (formData.endDate) {
      const endDate = new Date(formData.endDate);
      if (date > endDate) {
        setErrors((prev) => ({
          ...prev,
          endDate: 'End Date cannot be before Start Date',
        }));
      } else {
        setErrors((prev) => ({ ...prev, endDate: undefined }));
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      setFormData((prev) => ({
        ...prev,
        endDate: undefined,
      }));

      // Clear any end date errors when removing the end date
      if (errors.endDate) {
        setErrors((prev) => ({ ...prev, endDate: undefined }));
      }
      return;
    }

    // Check if end date is before start date
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (date < startDate) {
        setErrors((prev) => ({
          ...prev,
          endDate: 'End Date cannot be before Start Date',
        }));
      } else {
        setErrors((prev) => ({ ...prev, endDate: undefined }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      endDate: format(date, 'yyyy-MM-dd'),
    }));
  };

  const handleStatusChange = (value: EmployeeStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const updateDocument = (documentPath: string) => {
    setFormData((prev) => ({
      ...prev,
      idDocument: documentPath,
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    // If employee is terminated, end date is required
    if (formData.status === 'terminated' && !formData.endDate) {
      newErrors.endDate = 'End date is required for terminated employees';
    }

    // Validate that end date is not before start date
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        newErrors.endDate = 'End Date cannot be before Start Date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    onSave(formData);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    updateDocument,
    handleSubmit,
  };
}
