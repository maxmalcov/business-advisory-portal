
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmployeeData } from '../types';
import EmployeeSelector from './EmployeeSelector';
import TerminationDatePicker from './TerminationDatePicker';
import TerminationReasonSelector from './TerminationReasonSelector';
import AdditionalFields from './AdditionalFields';
import { useTerminationForm } from '../hooks/useTerminationForm';

interface TerminationFormProps {
  employees: EmployeeData[];
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  additionalVacationDays: string;
  setAdditionalVacationDays: (value: string) => void;
}

const TerminationForm = ({ 
  employees, 
  selectedEmployee, 
  setSelectedEmployee, 
  additionalVacationDays, 
  setAdditionalVacationDays 
}: TerminationFormProps) => {
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [terminationReason, setTerminationReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const { handleSubmit, isSubmitting } = useTerminationForm(selectedEmployee, terminationDate);
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(terminationReason);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <EmployeeSelector 
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
        
        <TerminationDatePicker
          terminationDate={terminationDate}
          setTerminationDate={setTerminationDate}
          isDatePickerOpen={isDatePickerOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
        />
        
        <TerminationReasonSelector
          terminationReason={terminationReason}
          setTerminationReason={setTerminationReason}
        />
        
        <AdditionalFields
          additionalVacationDays={additionalVacationDays}
          setAdditionalVacationDays={setAdditionalVacationDays}
          comments={comments}
          setComments={setComments}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Submit Termination Request'}
      </Button>
    </form>
  );
};

export default TerminationForm;
