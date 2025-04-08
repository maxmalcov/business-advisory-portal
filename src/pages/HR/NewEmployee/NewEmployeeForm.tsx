
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RequiredFields from './FormSections/RequiredFields';
import OptionalFields from './FormSections/OptionalFields';
import { useNewEmployeeForm } from './hooks/useNewEmployeeForm';
import EmployeeFormSubmitHandler from './components/EmployeeFormSubmitHandler';

const NewEmployeeForm: React.FC = () => {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    errors,
    setIsSubmitting,
    handleInputChange,
    handleFileChange,
    handleDateChange,
    handleSalaryTypeChange,
    validate,
    toast
  } = useNewEmployeeForm();

  return (
    <>
      <CardHeader>
        <CardTitle>{t('hr.new_employee.title')}</CardTitle>
        <CardDescription>Fill in the form below to register a new employee</CardDescription>
      </CardHeader>
      
      <EmployeeFormSubmitHandler
        formData={formData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        validate={validate}
        toast={toast}
      >
        <CardContent className="space-y-6">
          <RequiredFields 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleFileChange={handleFileChange}
          />
          
          <OptionalFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSalaryTypeChange={handleSalaryTypeChange}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            {t('app.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('app.loading') : t('app.submit')}
          </Button>
        </CardFooter>
      </EmployeeFormSubmitHandler>
    </>
  );
};

export default NewEmployeeForm;
