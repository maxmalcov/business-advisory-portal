
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmployeeData } from '../types';
import EmployeeSelector from './EmployeeSelector';
import TerminationDatePicker from './TerminationDatePicker';
import TerminationReasonSelector from './TerminationReasonSelector';
import AdditionalFields from './AdditionalFields';
import { useTerminationForm } from '../hooks/useTerminationForm';
import { employeesTable } from '@/integrations/supabase/client';

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
  const [employeeStartDate, setEmployeeStartDate] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (selectedEmployee) {
        try {
          const { data, error } = await employeesTable()
            .select('start_date')
            .eq('id', selectedEmployee)
            .single();
            
          if (error) {
            console.error('Error fetching employee start date:', error);
            setEmployeeStartDate(undefined);
            return;
          }
          
          // Check if data exists and contains start_date property
          if (data && typeof data === 'object' && 'start_date' in data) {
            // Explicitly type and ensure string type
            const startDate = data.start_date as string;
            setEmployeeStartDate(startDate);
          } else {
            setEmployeeStartDate(undefined);
          }
        } catch (err) {
          console.error('Error fetching employee start date:', err);
          setEmployeeStartDate(undefined);
        }
      } else {
        setEmployeeStartDate(undefined);
      }
    };
    
    fetchEmployeeData();
  }, [selectedEmployee]);
  
  const { handleSubmit, isSubmitting, dateError, setDateError } = useTerminationForm(
    selectedEmployee, 
    terminationDate,
    employeeStartDate
  );
  
  const onTerminationDateChange = (date: Date | undefined) => {
    setTerminationDate(date);
    
    // Clear any existing date errors
    setDateError(null);
    
    // Validate date if employee start date is available
    if (date && employeeStartDate) {
      const startDate = new Date(employeeStartDate);
      if (date < startDate) {
        setDateError('End Date cannot be before Start Date');
      }
    }
  };
  
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
          setTerminationDate={onTerminationDateChange}
          isDatePickerOpen={isDatePickerOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
          dateError={dateError}
          employeeStartDate={employeeStartDate}
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
      
      <Button type="submit" className="w-full" disabled={isSubmitting || !!dateError}>
        {isSubmitting ? 'Processing...' : 'Submit Termination Request'}
      </Button>
    </form>
  );
};

export default TerminationForm;
