import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RequiredFields from './FormSections/RequiredFields';
import OptionalFields from './FormSections/OptionalFields';
import { useNewEmployeeForm } from './hooks/useNewEmployeeForm';
import FormActions from './components/FormActions';
import { submitEmployeeForm } from './components/FormSubmissionHandler';
import { useAuth } from '@/context/AuthContext.tsx';
const NewEmployeeForm: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
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
    navigate,
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
          variant: 'destructive',
        });
      },
      user,
    });
  };
  return (
    <>
      <CardHeader className="py-0"></CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {/* Required Fields Section */}
          <div className="space-y-6">
            <RequiredFields
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange}
              handleFileChange={handleFileChange}
              uploadProgress={uploadProgress}
            />
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-6 pt-4">
            <OptionalFields
              formData={formData}
              handleInputChange={handleInputChange}
              handleSalaryTypeChange={handleSalaryTypeChange}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6">
          <FormActions isSubmitting={isSubmitting} onCancel={handleCancel} />
        </CardFooter>
      </form>
    </>
  );
};
export default NewEmployeeForm;
