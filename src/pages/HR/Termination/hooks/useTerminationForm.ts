
import { useState } from 'react';
import { calculateDaysWorked, submitTerminationRequest } from '../utils';
import { useToast } from '@/hooks/use-toast';
import {notificationSettingsTable, supabase} from "@/integrations/supabase/client.ts";
import {log} from "@/utils/logs/log.funciton.ts";
import {AppUser} from "@/context/AuthContext.tsx";
import {sendEmail} from "@/integrations/email";

interface FormData {
  employeeId: string;
  terminationDate: Date | null;
  reason: string;
  additionalNotes: string;
}

export function useTerminationForm(
  user: AppUser,
  employeeId?: string,
  terminationDate?: Date | undefined,
  employeeStartDate?: string,
) {
  const [formData, setFormData] = useState({
    // employeeId: employeeId || '',
    // terminationDate: terminationDate,
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
        terminationDate,
        reason,
        additionalNotes: comments,
        additionalVacationDays
      };
      console.log(submitData)

      const { data , error: settingsError } = await notificationSettingsTable()
          .select('email')
          .eq('category', 'hr_payroll')
          .maybeSingle();

      if(settingsError){
        throw new Error()
      }

      const { data: employee } = await supabase.from('employees').update({
        status: 'terminated',
        end_date: submitData.terminationDate.toISOString()
      }).eq('id', employeeId).select('*').single()

      log({ action: "Termination", description: `Employee ${employee.full_name} was terminated`, user: user.email, level: 'info', category: "Employee"})

      sendEmail((data as any).email, `Employee Termination Notice`, `
A termination request has been submitted by a client.

👤 Employee Name: ${employee.full_name}
📅 Termination Date: ${employee.end_date}
`)
      
      // const response = await submitTerminationRequest(submitData);
      
      // Add null checks for data
      // if (response?.data) {
      //   const { startDate, endDate } = response.data;
      //
      //   // Ensure we have valid dates before calculating
      //   if (startDate && endDate) {
      //     const calculatedDaysWorked = calculateDaysWorked(
      //       new Date(startDate),
      //       new Date(endDate)
      //     );
      //
      //     setDaysWorked(calculatedDaysWorked);
      //   }
      // }
      
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
