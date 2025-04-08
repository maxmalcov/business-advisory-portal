
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as EmployeeStatus)}>
      <ToggleGroupItem value="active" className="flex items-center gap-1">
        <User className="h-4 w-4" />
        <span>Active Employees</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="terminated" className="flex items-center gap-1">
        <UserMinus className="h-4 w-4" />
        <span>Terminated Employees</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default EmployeeStatusToggle;
