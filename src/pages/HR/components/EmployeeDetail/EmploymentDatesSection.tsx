
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Employee } from '../../types/employee';

interface EmploymentDatesSectionProps {
  employee: Employee;
}

const EmploymentDatesSection: React.FC<EmploymentDatesSectionProps> = ({ employee }) => {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      // Ensure we have a valid date string
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        Employment Dates
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Start Date</p>
          <p className="text-sm">{formatDate(employee.startDate)}</p>
        </div>
        {(employee.status === 'terminated' || employee.endDate) && (
          <div>
            <p className="text-sm font-medium">End Date</p>
            <p className="text-sm">{formatDate(employee.endDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmploymentDatesSection;
