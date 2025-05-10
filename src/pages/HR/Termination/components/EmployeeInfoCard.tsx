import React from 'react';
import { EmployeeData } from '../types';
import BasicInfo from './EmployeeInfoSections/BasicInfo';
import DateInfo from './EmployeeInfoSections/DateInfo';
import VacationInfo from './EmployeeInfoSections/VacationInfo';
import EmptyState from './EmployeeInfoSections/EmptyState';

interface EmployeeInfoCardProps {
  selectedEmployeeData: EmployeeData | undefined;
  additionalVacationDays: string;
}

const EmployeeInfoCard = ({
  selectedEmployeeData,
  additionalVacationDays,
}: EmployeeInfoCardProps) => {
  if (!selectedEmployeeData) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <BasicInfo employeeData={selectedEmployeeData} />
      <DateInfo employeeData={selectedEmployeeData} />
      {/*<VacationInfo */}
      {/*  employeeData={selectedEmployeeData}*/}
      {/*  additionalVacationDays={additionalVacationDays}*/}
      {/*/>*/}
    </div>
  );
};

export default EmployeeInfoCard;
