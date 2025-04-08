
import React from 'react';
import { Briefcase, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '../../types/employee';

interface IdentificationSectionProps {
  employee: Employee;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ employee }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <Briefcase className="h-4 w-4 mr-2" />
        Identification
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">DNI/TIE</p>
          <p className="text-sm">{employee.dniTie || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">ID Document</p>
          {employee.idDocument ? (
            <div className="flex items-center">
              <span className="text-sm truncate max-w-[200px]">{employee.idDocument}</span>
              <Button variant="ghost" size="sm" className="ml-2">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View document</span>
              </Button>
            </div>
          ) : (
            <p className="text-sm">-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentificationSection;
