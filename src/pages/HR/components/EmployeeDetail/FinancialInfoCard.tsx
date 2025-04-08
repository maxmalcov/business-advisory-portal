
import React from 'react';
import { Employee } from '../../types/employee';
import { DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialInfoCardProps {
  employee: Employee;
}

const FinancialInfoCard: React.FC<FinancialInfoCardProps> = ({ employee }) => {
  if (!employee.salary && !employee.iban) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-md font-medium flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
          Financial Information
        </h3>
      </div>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {employee.salary && (
            <div>
              <p className="text-sm font-medium text-gray-500">Salary</p>
              <p className="text-sm font-semibold">
                {employee.salary} EUR {employee.salaryType === 'gross' ? '(Gross)' : '(Net)'}
              </p>
            </div>
          )}
          
          {employee.iban && (
            <div>
              <p className="text-sm font-medium text-gray-500">IBAN</p>
              <p className="text-sm font-semibold">{employee.iban}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialInfoCard;
