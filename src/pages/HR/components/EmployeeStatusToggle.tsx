
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserMinus } from 'lucide-react';
import { EmployeeStatus } from '../types/employee';

interface EmployeeStatusToggleProps {
  value: EmployeeStatus;
  onChange: (value: EmployeeStatus) => void;
}

const EmployeeStatusToggle: React.FC<EmployeeStatusToggleProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'active' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => onChange('active')}
      >
        <User className="h-4 w-4" />
        <span>New Employees</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'terminated' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => onChange('terminated')}
      >
        <UserMinus className="h-4 w-4" />
        <span>Terminated Employees</span>
      </Button>
    </div>
  );
};

export default EmployeeStatusToggle;
