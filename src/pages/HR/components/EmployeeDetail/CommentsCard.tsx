
import React from 'react';
import { Employee } from '../../types/employee';
import { Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CommentsCardProps {
  employee: Employee;
}

const CommentsCard: React.FC<CommentsCardProps> = ({ employee }) => {
  if (!employee.comments) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-md font-medium flex items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-600" />
          Additional Comments
        </h3>
      </div>
      <CardContent className="pt-4">
        <p className="text-sm whitespace-pre-line">{employee.comments}</p>
      </CardContent>
    </Card>
  );
};

export default CommentsCard;
