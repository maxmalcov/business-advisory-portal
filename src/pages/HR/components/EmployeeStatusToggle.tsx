
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { User, UserMinus } from 'lucide-react';

interface EmployeeStatusToggleProps {
  value: 'active' | 'terminated';
  onChange: (value: 'active' | 'terminated') => void;
}

const EmployeeStatusToggle: React.FC<EmployeeStatusToggleProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Employee List</h2>
      <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as 'active' | 'terminated')}>
        <ToggleGroupItem value="active" aria-label="New Employees" className="gap-2">
          <User className="h-4 w-4" />
          <span>New Employees</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="terminated" aria-label="Terminated Employees" className="gap-2">
          <UserMinus className="h-4 w-4" />
          <span>Terminated Employees</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default EmployeeStatusToggle;
