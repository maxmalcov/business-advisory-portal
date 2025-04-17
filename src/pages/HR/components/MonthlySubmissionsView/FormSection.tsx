
import React from 'react';
import { WorkHoursData } from '../../hooks/useEmployeeWorkHours';
import WorkHoursForm from '../WorkHoursForm';
import { useMonthlySubmissions } from './MonthlySubmissionsContext';

interface FormSectionProps {
  isSubmitted: boolean;
  workHours: WorkHoursData[];
  onSubmitForm: (values: WorkHoursData) => Promise<void>;
}

const FormSection: React.FC<FormSectionProps> = ({
  isSubmitted,
  workHours,
  onSubmitForm,
}) => {
  const { editingEmployee, handleCancelEdit } = useMonthlySubmissions();

  if (isSubmitted || !editingEmployee) {
    return null;
  }

  return (
    <div className="mt-6">
      <WorkHoursForm
        onSubmit={onSubmitForm}
        editingId={editingEmployee.id}
        initialValues={editingEmployee}
        onCancel={handleCancelEdit}
        existingEmployees={workHours}
      />
    </div>
  );
};

export default FormSection;
