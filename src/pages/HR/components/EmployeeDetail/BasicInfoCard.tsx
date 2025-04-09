
import React from 'react';
import { Employee } from '../../types/employee';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BasicInfoCardProps {
  employee: Employee;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ employee }) => {
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <User className="h-4 w-4 mr-2 text-primary" />
          Basic Information
        </h3>
      </div>
      <CardContent className="pt-4 bg-card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company Name</p>
            <p className="text-sm font-semibold text-foreground">{employee.companyName || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-foreground">{employee.status === 'active' ? 'Active' : 'Terminated'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Position</p>
            <p className="text-sm font-semibold text-foreground">{employee.position || '-'}</p>
          </div>
          {employee.email && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-foreground">{employee.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
