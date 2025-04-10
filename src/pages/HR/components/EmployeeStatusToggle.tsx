
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserMinus, Users, Check } from 'lucide-react';
import { EmployeeStatus } from '../types/employee';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        className={value === 'active' ? 'bg-accent text-accent-foreground' : ''}
        onClick={() => onChange('active')}
      >
        {value === 'active' ? (
          <Badge variant="outline" className="px-2 py-0.5 bg-[#F2FCE2] border-[#F2FCE2] text-[#4CAF50] flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-[#4CAF50]" />
            <span>Active</span>
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Active Employees</span>
          </div>
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={value === 'terminated' ? 'bg-accent text-accent-foreground' : ''}
        onClick={() => onChange('terminated')}
      >
        {value === 'terminated' ? (
          <Badge variant="outline" className="px-2 py-0.5 bg-[#ea384c] border-[#ea384c] text-white flex items-center">
            <span>Terminated</span>
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <UserMinus className="h-4 w-4" />
            <span>Terminated Employees</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default EmployeeStatusToggle;
