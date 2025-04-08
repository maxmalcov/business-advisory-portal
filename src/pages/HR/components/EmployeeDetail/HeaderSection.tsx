
import React from 'react';
import { Employee } from '../../types/employee';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderSectionProps {
  employee: Employee;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ employee }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-gray-100">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
            {getInitials(employee.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{employee.fullName}</h2>
          <p className="text-gray-500">{employee.position}</p>
        </div>
      </div>
      {employee.status === 'active' ? (
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded-md flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">Active</span>
        </div>
      ) : (
        <Badge className="bg-red-500">Terminated</Badge>
      )}
    </div>
  );
};

export default HeaderSection;
