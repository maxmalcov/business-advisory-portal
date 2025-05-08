
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import EmployeeSelector from "@/pages/HR/Termination/components/EmployeeSelector.tsx";
import { Employee } from '../../types/employee';
import { FormValues } from './types';
import {useEmployeeData} from "@/pages/HR/Termination/hooks/useEmployeeData.ts";
import FormFields from "@/pages/HR/components/WorkHoursForm/FormFields.tsx";
import {Form} from "@/components/ui/form.tsx";

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
  const { employees, isLoading } = useEmployeeData();
  const safeExistingEmployees = Array.isArray(existingEmployees) ? existingEmployees : [];
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select an Employee</h3>
      <p className="text-sm text-muted-foreground">
        Choose an employee from the list or add a new one manually.
      </p>
      
      {/*<EmployeeSelector*/}
      {/*  existingEmployees={safeExistingEmployees}*/}
      {/*  onSelectEmployee={onSelectEmployee}*/}
      {/*/>*/}
    <EmployeeSelector
        employees={employees}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
    />

    </div>
  );
};

export default EmployeeSelectionStep;
