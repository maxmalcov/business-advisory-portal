
import React, { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useActiveEmployees } from '../../hooks/useActiveEmployees';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '../../types/employee';
import { EmployeeSelectorProps } from './types';
import EmployeeListItem from './EmployeeListItem';
import EmptyState from './EmptyState';
import ManualEntryOption from './ManualEntryOption';

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  existingEmployees,
  onSelectEmployee,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { activeEmployees = [], isLoading } = useActiveEmployees();
  const { toast } = useToast();

  // Ensure existingEmployees and activeEmployees are always arrays
  const safeExistingEmployees = Array.isArray(existingEmployees) ? existingEmployees : [];
  const safeActiveEmployees = Array.isArray(activeEmployees) ? activeEmployees : [];

  // Filter out employees that have already been added
  const availableEmployees = safeActiveEmployees.filter(emp => 
    !safeExistingEmployees.some(existing => 
      existing.employeeId === emp.id || 
      existing.employeeName === emp.fullName
    )
  );

  const handleSelectEmployee = (employee: Employee) => {
    // Check if this employee has already been added
    console.log(safeExistingEmployees)
    if (safeExistingEmployees.some(existing =>
      existing.employeeId === employee.id ||
      existing.employeeName === employee.fullName
    )) {
      toast({
        title: "Employee already added",
        description: `${employee.fullName} is already on the list for this month.`,
        variant: "destructive"
      });
      return;
    }
    console.log('LOG!!!!!')

    onSelectEmployee(employee);
    setOpen(false);
  };

  const handleAddManually = () => {
    onSelectEmployee(null); // Passing null indicates manual entry
    setOpen(false);
  };

  return (
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading ? "Loading employees..." : "Select an employee"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
              placeholder="Search employees..."
              value={search ?? ''}
              onValueChange={(value) => setSearch(value ?? '')}
          />

          {isLoading ? (
            <EmptyState isLoading={true} />
          ) : (
            <>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup heading="Active Employees">
                {(availableEmployees ?? []).length > 0 ? (
                    availableEmployees.map((employee) => (
                        <EmployeeListItem
                            key={employee.id}
                            employee={employee}
                            onSelect={handleSelectEmployee}
                        />
                    ))
                ) : (
                    <EmptyState isLoading={false} />
                )}
              </CommandGroup>

              <ManualEntryOption onAddManually={handleAddManually} />
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeeSelector;
