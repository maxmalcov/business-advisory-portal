import React from 'react';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Employee } from '../../types/employee';

interface BasicInfoSectionProps {
  employee: Employee;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ employee }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center">
        <User className="h-4 w-4 mr-2" />
        Basic Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Full Name</p>
          <p className="text-sm">{employee.fullName}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Position/Role</p>
          <p className="text-sm">{employee.position}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Status</p>
          <Badge
            className={
              employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }
          >
            {employee.status === 'active' ? 'Active' : 'Terminated'}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium">Company Name</p>
          <p className="text-sm">{employee.companyName || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
