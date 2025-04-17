
import React from 'react';
import { User } from 'lucide-react';
import { CommandItem } from '@/components/ui/command';
import { EmployeeListItemProps } from './types';

const EmployeeListItem: React.FC<EmployeeListItemProps> = ({ employee, onSelect }) => {
  return (
    <CommandItem
      key={employee.id}
      value={employee.fullName}
      onSelect={() => onSelect(employee)}
    >
      <User className="mr-2 h-4 w-4" />
      <span className="font-medium">{employee.fullName}</span>
      {employee.position && (
        <span className="ml-2 text-muted-foreground">
          - {employee.position}
        </span>
      )}
    </CommandItem>
  );
};

export default EmployeeListItem;
