
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { employeesTable } from '@/integrations/supabase/client';

export const useTerminationForm = (selectedEmployee: string, terminationDate: Date | undefined) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
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
    
    return true;
  };
  
  const handleSubmit = async (terminationReason: string) => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await employeesTable()
        .update({
          status: 'terminated',
          end_date: terminationDate.toISOString().split('T')[0]
        })
        .eq('id', selectedEmployee);
        
      if (error) throw error;
      
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
    validateForm
  };
};
