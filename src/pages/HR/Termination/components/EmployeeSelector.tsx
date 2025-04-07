
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeData } from '../types';

interface EmployeeSelectorProps {
  employees: EmployeeData[];
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
}

const EmployeeSelector = ({ 
  employees, 
  selectedEmployee, 
  setSelectedEmployee 
}: EmployeeSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="employee">{t('hr.termination.employee')}</Label>
      <Select 
        value={selectedEmployee}
        onValueChange={setSelectedEmployee}
      >
        <SelectTrigger id="employee">
          <SelectValue placeholder="Select an employee" />
        </SelectTrigger>
        <SelectContent>
          {employees.map(employee => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name} - {employee.position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSelector;
