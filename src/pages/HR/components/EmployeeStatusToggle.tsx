
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserMinus, Users } from 'lucide-react';
import { EmployeeStatus } from '../types/employee';

interface EmployeeStatusToggleProps {
  value: EmployeeStatus | 'all';
  onChange: (value: EmployeeStatus | 'all') => void;
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
        className={`flex items-center gap-2 ${value === 'all' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => onChange('all')}
      >
        <Users className="h-4 w-4" />
        <span>All Employees</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${value === 'active' ? 'bg-accent text-accent-foreground' : ''}`}
        onClick={() => onChange('active')}
      >
        <User className="h-4 w-4" />
        <span>Active Employees</span>
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
