
import React, { useState } from 'react';
import { Employee, EmployeeStatus } from '../types/employee';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';
import {
  BasicInfoFormSection,
  IdentificationFormSection,
  EmploymentDatesFormSection,
  ScheduleFormSection
} from './EmployeeDetail/form';

interface EmployeeDetailFormProps {
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EmployeeDetailForm: React.FC<EmployeeDetailFormProps> = ({
  employee,
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Employee>({
    ...employee
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    
    if (errors[name as keyof Employee]) {
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
    const newErrors: Partial<Record<keyof Employee, string>> = {};
    
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
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoFormSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleStatusChange={handleStatusChange}
      />
      
      <IdentificationFormSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <EmploymentDatesFormSection 
        formData={formData}
        errors={errors}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
      />
      
      <ScheduleFormSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeDetailForm;
