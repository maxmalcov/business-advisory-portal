
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RequiredFields from './FormSections/RequiredFields';
import OptionalFields from './FormSections/OptionalFields';
import { useNewEmployeeForm } from './hooks/useNewEmployeeForm';
import FormActions from './components/FormActions';
import { submitEmployeeForm } from './components/FormSubmissionHandler';

const NewEmployeeForm: React.FC = () => {
  const { t } = useLanguage();
  const {
    formData,
    errors,
    isSubmitting,
    uploadProgress,
    setIsSubmitting,
    setUploadProgress,
    handleInputChange,
    handleFileChange,
    handleDateChange,
    handleSalaryTypeChange,
    validate,
    handleCancel,
    toast,
    navigate
  } = useNewEmployeeForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    await submitEmployeeForm({
      formData,
      setIsSubmitting,
      setUploadProgress,
      onSuccess: () => {
        toast({
          title: 'Employee Added',
          description: 'New employee has been successfully added.',
        });
        navigate('/hr');
      },
      onError: (message) => {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{t('hr.new_employee.title')}</CardTitle>
        <CardDescription>Fill in the form below to register a new employee</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <RequiredFields 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleFileChange={handleFileChange}
            uploadProgress={uploadProgress}
          />
          
          <OptionalFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSalaryTypeChange={handleSalaryTypeChange}
          />
        </CardContent>
        
        <CardFooter>
          <FormActions 
            isSubmitting={isSubmitting} 
            onCancel={handleCancel} 
          />
        </CardFooter>
      </form>
    </>
  );
};

export default NewEmployeeForm;
