
import React from 'react';
import { Clock } from 'lucide-react';
import { Employee } from '../../types/employee';

interface ScheduleSectionProps {
  employee: Employee;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ employee }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        Schedule
      </h3>
      <div>
        <p className="text-sm font-medium">Weekly Working Schedule</p>
        <p className="text-sm whitespace-pre-line">{employee.weeklySchedule || '-'}</p>
      </div>
    </div>
  );
};

export default ScheduleSection;
