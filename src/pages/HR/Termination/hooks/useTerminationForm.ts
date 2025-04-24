import { useState } from 'react';
import { calculateDaysWorked, submitTerminationRequest } from '../utils';

interface FormData {
  employeeId: string;
  terminationDate: Date | null;
  reason: string;
  additionalNotes: string;
}

interface TerminationResponse {
  data: {
    startDate: string;
    endDate: string;
  };
}

export function useTerminationForm() {
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    terminationDate: null,
    reason: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [daysWorked, setDaysWorked] = useState(0);

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

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await submitTerminationRequest(formData);
      
      // Add null checks for data
      if (response?.data) {
        const { startDate, endDate } = response.data;
        
        // Ensure we have valid dates before calculating
        if (startDate && endDate) {
          const daysWorked = calculateDaysWorked(
            new Date(startDate),
            new Date(endDate)
          );
          
          setDaysWorked(daysWorked);
        }
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);
      
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting termination form:', error);
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
  };

  return {
    formData,
    isSubmitting,
    isSubmitted,
    daysWorked,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    resetForm,
  };
}
