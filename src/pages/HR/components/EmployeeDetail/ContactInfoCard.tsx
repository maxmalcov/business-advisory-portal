
import React from 'react';
import { Employee } from '../../types/employee';
import { Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactInfoCardProps {
  employee: Employee;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ employee }) => {
  if (!employee.address) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-md font-medium flex items-center">
          <Home className="h-4 w-4 mr-2 text-blue-600" />
          Contact Information
        </h3>
      </div>
      <CardContent className="pt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-sm font-semibold">{employee.address}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
