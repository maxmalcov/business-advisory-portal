import React from 'react';
import { Clock } from 'lucide-react';
import { Employee } from '../../types/employee';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduleSectionProps {
  employee: Employee;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ employee }) => {
  const hasSchedule =
    employee.weeklySchedule && employee.weeklySchedule.trim().length > 0;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        Schedule
      </h3>

      {hasSchedule ? (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-1">Weekly Working Schedule</p>
            <p className="text-sm whitespace-pre-line">
              {employee.weeklySchedule}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No schedule information available
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;
