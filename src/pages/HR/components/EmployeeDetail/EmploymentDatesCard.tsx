
import React from 'react';
import { Employee } from '../../types/employee';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmploymentDatesCardProps {
  employee: Employee;
  formatDate: (dateStr: string | undefined) => string;
}

const EmploymentDatesCard: React.FC<EmploymentDatesCardProps> = ({ employee, formatDate }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-md font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          Employment Dates
        </h3>
      </div>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="text-sm font-semibold">{formatDate(employee.startDate)}</p>
          </div>
          {(employee.status === 'terminated' || employee.endDate) && (
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-sm font-semibold">{formatDate(employee.endDate)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentDatesCard;
