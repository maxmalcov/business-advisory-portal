
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData } from '../types';
import { createEmployee, uploadEmployeeDocument, updateEmployeeWithFileUrl } from '../services/employeeService';

interface EmployeeFormSubmitHandlerProps {
  formData: FormData;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  validate: () => boolean;
  toast: any;
  children: React.ReactNode;
}

const EmployeeFormSubmitHandler: React.FC<EmployeeFormSubmitHandlerProps> = ({
  formData,
  isSubmitting,
  setIsSubmitting,
  validate,
  toast,
  children
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting employee data:', formData);
      
      // First create the employee record
      const employeeRecord = await createEmployee(formData);
      console.log('Employee added successfully:', employeeRecord);
      
      // Safely extract the employee ID from the response
      if (Array.isArray(employeeRecord) && employeeRecord.length > 0) {
        const dbEmployee = employeeRecord[0];
        
        // Check if the response has the expected structure with proper null checking
        if (dbEmployee && typeof dbEmployee === 'object' && 'id' in dbEmployee && dbEmployee.id) {
          const employeeId = dbEmployee.id;
          
          // If there's a file to upload, upload it to storage
          if (formData.idDocument) {
            try {
              const urlData = await uploadEmployeeDocument(employeeId, formData.idDocument);
              
              // Update the employee record with the file URL
              if (urlData) {
                await updateEmployeeWithFileUrl(employeeId, urlData.publicUrl);
              }
            } catch (uploadError) {
              console.error('File handling error:', uploadError);
              // Continue even if file upload fails
            }
          }
        } else {
          console.error('Unexpected employee record structure:', dbEmployee);
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
