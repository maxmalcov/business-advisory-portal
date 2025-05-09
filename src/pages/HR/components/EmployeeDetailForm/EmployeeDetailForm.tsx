import React from 'react';
import { Employee } from '../../types/employee';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';
import BasicInfoFormSection from './BasicInfoFormSection';
import IdentificationFormSection from './IdentificationFormSection';
import EmploymentDatesFormSection from './EmploymentDatesFormSection';
import ScheduleFormSection from './ScheduleFormSection';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface EmployeeDetailFormProps {
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EmployeeDetailForm: React.FC<EmployeeDetailFormProps> = ({
  employee,
  onSave,
  onCancel,
  isSubmitting: externalIsSubmitting,
}) => {
  const {
    formData,
    errors,
    isSubmitting: internalIsSubmitting,
    handleInputChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    updateDocument,
    handleSubmit,
  } = useEmployeeForm(employee, onSave);

  // Use external isSubmitting state if provided, otherwise use the internal one
  const isSubmittingState = externalIsSubmitting || internalIsSubmitting;
  const { t } = useLanguage();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <BasicInfoFormSection
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleStatusChange={handleStatusChange}
      />

      <IdentificationFormSection
        formData={formData}
        handleInputChange={handleInputChange}
        updateDocument={updateDocument}
      />

      <EmploymentDatesFormSection
        formData={formData}
        errors={errors}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
      />

      <ScheduleFormSection
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmittingState}
        >
          <X className="h-4 w-4 mr-2" />
          {t('hr.index.employee.detail-from.button.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmittingState}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmittingState
            ? t('hr.index.employee.detail-from.button.saving')
            : t('hr.index.employee.detail-from.button.save')}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeDetailForm;
