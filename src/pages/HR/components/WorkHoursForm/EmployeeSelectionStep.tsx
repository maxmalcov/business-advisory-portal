
import React from 'react';
import { Button } from '@/components/ui/button';
import EmployeeSelector from '../EmployeeSelector';
import { Employee } from '../../types/employee';
import { FormValues } from './types';

interface EmployeeSelectionStepProps {
  existingEmployees: FormValues[];
  onSelectEmployee: (employee: Employee | null) => void;
  onCancel: () => void;
}

const EmployeeSelectionStep: React.FC<EmployeeSelectionStepProps> = ({
  existingEmployees,
  onSelectEmployee,
  onCancel,
}) => {
  // Ensure existingEmployees is always an array
  const safeExistingEmployees = Array.isArray(existingEmployees) ? existingEmployees : [];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select an Employee</h3>
      <p className="text-sm text-muted-foreground">
        Choose an employee from the list or add a new one manually.
      </p>
      
      <EmployeeSelector 
        existingEmployees={safeExistingEmployees}
        onSelectEmployee={onSelectEmployee}
      />
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSelectionStep;
