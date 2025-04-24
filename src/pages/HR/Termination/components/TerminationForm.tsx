
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
          
          if (data && 'start_date' in data) {
            const startDate = typeof data.start_date === 'string' ? data.start_date : undefined;
            setEmployeeStartDate(startDate);
          } else {
            console.warn('Employee data not found or missing start_date:', selectedEmployee);
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
  
  const { 
    handleSubmit, 
    isSubmitting, 
    dateError, 
    setDateError 
  } = useTerminationForm(selectedEmployee, terminationDate, employeeStartDate);
  
  const onTerminationDateChange = (date: Date | undefined) => {
    setTerminationDate(date);
    
    if (setDateError) {
      setDateError(null);
      
      if (date && employeeStartDate) {
        const startDate = new Date(employeeStartDate);
        if (date < startDate) {
          setDateError('End Date cannot be before Start Date');
        }
      }
    }
  };
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(terminationReason, comments, additionalVacationDays);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-6">
        <EmployeeSelector 
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
        
        <AdditionalFields
          additionalVacationDays={additionalVacationDays}
          setAdditionalVacationDays={setAdditionalVacationDays}
          comments={comments}
          setComments={setComments}
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting || !!dateError}
          className="min-w-[150px]"
        >
          {isSubmitting ? 'Processing...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default TerminationForm;
