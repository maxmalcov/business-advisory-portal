
import React from 'react';
import { Employee } from '../../types/employee';
import { DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialInfoCardProps {
  employee: Employee;
}

const FinancialInfoCard: React.FC<FinancialInfoCardProps> = ({ employee }) => {
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <DollarSign className="h-4 w-4 mr-2 text-primary" />
          Financial Information
        </h3>
      </div>
      <CardContent className="pt-4 grid grid-cols-2 gap-4 bg-card">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Salary</p>
          <p className="text-sm font-semibold text-foreground">
            {employee.salary ? `${employee.salary} ${employee.salaryType === 'gross' ? '(Gross)' : '(Net)'}` : '-'}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">IBAN</p>
          <p className="text-sm font-semibold text-foreground">{employee.iban || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Social Security Number</p>
          <p className="text-sm font-semibold text-foreground">{employee.socialSecurityNumber || '-'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialInfoCard;
