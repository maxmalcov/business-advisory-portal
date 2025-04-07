
import React from 'react';
import { format } from 'date-fns';
import { EmployeeData } from '../../types';

interface DateInfoProps {
  employeeData: EmployeeData;
}

const DateInfo = ({ employeeData }: DateInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
      <p>{format(employeeData.startDate, 'PPP')}</p>
    </div>
  );
};

export default DateInfo;
