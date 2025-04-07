
import React from 'react';
import { EmployeeData } from '../../types';

interface BasicInfoProps {
  employeeData: EmployeeData;
}

const BasicInfo = ({ employeeData }: BasicInfoProps) => {
  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
        <p className="font-medium">{employeeData.name}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
        <p>{employeeData.position}</p>
      </div>
    </>
  );
};

export default BasicInfo;
