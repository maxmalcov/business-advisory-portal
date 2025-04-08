
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { employeesTable } from '@/integrations/supabase/client';

interface EmployeeFormSubmitHandlerProps {
  formData: FormData;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  validate: () => boolean;
}

const EmployeeFormSubmitHandler: React.FC<EmployeeFormSubmitHandlerProps> = ({
  formData,
  isSubmitting,
  setIsSubmitting,
  validate,
  children,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting employee data:', formData);
      
      // Updated to include all relevant fields from the form
      const employeeData = {
        full_name: formData.fullName,
        position: formData.position,
        status: 'active',
        start_date: formData.startDate?.toISOString().split('T')[0],
        company_name: formData.companyName || null,
        dni_tie: formData.employeeDni || null,
        weekly_schedule: formData.schedule || null,
        id_document: formData.idDocument ? formData.idDocument.name : null
      };
      
      console.log('Sending employee data to Supabase:', employeeData);
      
      const { data: employeeRecord, error } = await employeesTable()
        .insert(employeeData)
        .select();
        
      if (error) throw error;
      
      console.log('Employee added successfully:', employeeRecord);
      
      // Fix TypeScript errors with proper null/undefined checks
      if (Array.isArray(employeeRecord) && employeeRecord.length > 0) {
        const dbEmployee = employeeRecord[0];
        if (dbEmployee && typeof dbEmployee === 'object' && 'id' in dbEmployee) {
          console.log(`Created employee with ID: ${dbEmployee.id}`);
        }
      }
      
      toast({
        title: 'Employee Added',
        description: 'New employee has been successfully added.',
      });
      
      navigate('/hr');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the employee.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default EmployeeFormSubmitHandler;
