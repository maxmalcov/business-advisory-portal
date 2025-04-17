
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, UserPlus, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveEmployees } from '../hooks/useActiveEmployees';
import { Employee } from '../types/employee';
import { FormValues } from './WorkHoursForm';
import { useToast } from '@/hooks/use-toast';

interface EmployeeSelectorProps {
  existingEmployees: FormValues[];
  onSelectEmployee: (employee: Employee | null) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  existingEmployees,
  onSelectEmployee,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { activeEmployees, isLoading } = useActiveEmployees();
  const { toast } = useToast();

  // Filter out employees that have already been added
  const availableEmployees = activeEmployees.filter(emp => 
    !existingEmployees.some(existing => existing.employeeId === emp.id)
  );

  const handleSelectEmployee = (employee: Employee) => {
    // Check if this employee has already been added
    if (existingEmployees.some(existing => existing.employeeId === employee.id)) {
      toast({
        title: "Employee already added",
        description: `${employee.fullName} is already on the list for this month.`,
        variant: "destructive"
      });
      return;
    }
    
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
            value={search}
            onValueChange={setSearch}
          />
          {isLoading ? (
            <div className="py-6 text-center text-sm">Loading employees...</div>
          ) : (
            <>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup heading="Active Employees">
                {availableEmployees.map((employee) => (
                  <CommandItem
                    key={employee.id}
                    value={employee.fullName}
                    onSelect={() => handleSelectEmployee(employee)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">{employee.fullName}</span>
                    {employee.position && (
                      <span className="ml-2 text-muted-foreground">
                        - {employee.position}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="border-t p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={handleAddManually}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Manually
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeeSelector;
