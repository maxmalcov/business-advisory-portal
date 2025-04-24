
import { useState } from 'react';
import { calculateDaysWorked, submitTerminationRequest } from '../utils';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  employeeId: string;
  terminationDate: Date | null;
  reason: string;
  additionalNotes: string;
}

export function useTerminationForm(
  employeeId?: string,
  terminationDate?: Date | undefined,
  employeeStartDate?: string
) {
  const [formData, setFormData] = useState<FormData>({
    employeeId: employeeId || '',
    terminationDate: terminationDate || null,
    reason: '',
    additionalNotes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [daysWorked, setDaysWorked] = useState(0);
  const [dateError, setDateError] = useState<string | null>(null);
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      terminationDate: date,
    }));
  };

  const handleSubmit = async (reason: string, comments: string, additionalVacationDays: string) => {
    try {
      if (dateError) {
        toast.toast({
          title: "Error",
          description: "Please fix the date errors before submitting",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubmitting(true);
      
      const submitData = {
        ...formData,
        reason,
        additionalNotes: comments,
        additionalVacationDays
      };
      
      const response = await submitTerminationRequest(submitData);
      
      // Add null checks for data
      if (response?.data) {
        const { startDate, endDate } = response.data;
        
        // Ensure we have valid dates before calculating
        if (startDate && endDate) {
          const calculatedDaysWorked = calculateDaysWorked(
            new Date(startDate),
            new Date(endDate)
          );
          
          setDaysWorked(calculatedDaysWorked);
        }
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      toast.toast({
        title: "Success",
        description: "Termination request submitted successfully"
      });
      
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting termination form:', error);
      
      toast.toast({
        title: "Error",
        description: "Failed to submit termination request",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      terminationDate: null,
      reason: '',
      additionalNotes: '',
    });
    setIsSubmitted(false);
    setDaysWorked(0);
    setDateError(null);
  };

  return {
    formData,
    isSubmitting,
    isSubmitted,
    daysWorked,
    dateError,
    setDateError,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    resetForm,
  };
}
