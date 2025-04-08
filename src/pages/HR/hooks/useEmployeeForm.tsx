
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Employee, EmployeeStatus } from '../types/employee';

interface FormErrors {
  fullName?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
}

export function useEmployeeForm(employee: Employee, onSave: (updatedEmployee: Employee) => void) {
  const [formData, setFormData] = useState<Employee>({
    ...employee
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setFormData((prev) => ({ 
      ...prev, 
      startDate: format(date, 'yyyy-MM-dd')
    }));
    
    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      setFormData((prev) => ({ 
        ...prev, 
        endDate: undefined
      }));
      return;
    }
    
    setFormData((prev) => ({ 
      ...prev, 
      endDate: format(date, 'yyyy-MM-dd')
    }));
  };

  const handleStatusChange = (value: EmployeeStatus) => {
    setFormData((prev) => ({ 
      ...prev, 
      status: value 
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
    handleSubmit
  };
}
