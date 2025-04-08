
import React from 'react';
import { Employee } from '../../types/employee';
import BasicInfoSection from './BasicInfoSection';
import IdentificationSection from './IdentificationSection';
import EmploymentDatesSection from './EmploymentDatesSection';
import ScheduleSection from './ScheduleSection';

interface EmployeeDetailViewProps {
  employee: Employee;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <BasicInfoSection employee={employee} />
      <IdentificationSection employee={employee} />
      <EmploymentDatesSection employee={employee} />
      <ScheduleSection employee={employee} />
    </div>
  );
};

export default EmployeeDetailView;
