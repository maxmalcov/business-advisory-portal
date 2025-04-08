
import React from 'react';
import { Employee } from '../../types/employee';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BasicInfoCardProps {
  employee: Employee;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ employee }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-md font-medium flex items-center">
          <User className="h-4 w-4 mr-2 text-blue-600" />
          Basic Information
        </h3>
      </div>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Company Name</p>
            <p className="text-sm font-semibold">{employee.companyName || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-sm font-semibold">{employee.status === 'active' ? 'Active' : 'Terminated'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Position</p>
            <p className="text-sm font-semibold">{employee.position || '-'}</p>
          </div>
          {employee.email && (
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm font-semibold">{employee.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
