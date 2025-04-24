
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { employeesTable, supabase } from '@/integrations/supabase/client';
import { Employee } from '@/pages/HR/types/employee';

export const useTerminationForm = (selectedEmployee: string, terminationDate: Date | undefined, employeeStartDate?: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  
  const validateForm = () => {
    setDateError(null);
    
    if (!selectedEmployee) {
      toast({
        title: t('app.warning'),
        description: 'Please select an employee',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!terminationDate) {
      toast({
        title: t('app.warning'),
        description: 'Please select a termination date',
        variant: 'destructive'
      });
      return false;
    }
    
    if (employeeStartDate) {
      const startDate = new Date(employeeStartDate);
      if (terminationDate < startDate) {
        setDateError('End Date cannot be before Start Date');
        toast({
          title: t('app.warning'),
          description: 'End Date cannot be before Start Date',
          variant: 'destructive'
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (terminationReason: string, comments?: string, additionalVacationDays?: string) => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, get the employee data
      const { data, error: fetchError } = await employeesTable()
        .select('full_name')
        .eq('id', selectedEmployee)
        .single();

      if (fetchError) {
        console.error('Error fetching employee data:', fetchError);
        throw new Error('Employee not found');
      }

      // Safely type the employee data
      const employeeData = data as { full_name: string };
      
      if (!employeeData || !employeeData.full_name) {
        throw new Error('Employee data is incomplete');
      }

      // Now update the employee status
      const { error } = await employeesTable()
        .update({
          status: 'terminated',
          end_date: terminationDate?.toISOString().split('T')[0]
        })
        .eq('id', selectedEmployee);
        
      if (error) throw error;

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('notify-admin-termination', {
        body: {
          employeeName: employeeData.full_name,
          terminationDate: terminationDate?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          terminationReason,
          additionalVacationDays: additionalVacationDays || '0',
          comments
        },
      });

      if (emailError) {
        console.error('Error sending termination notification:', emailError);
      }
      
      toast({
        title: t('app.success'),
        description: 'Termination process completed successfully',
      });
      
      navigate('/hr');
    } catch (error) {
      console.error('Error terminating employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete termination process',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleSubmit,
    isSubmitting,
    validateForm,
    dateError,
    setDateError
  };
};
