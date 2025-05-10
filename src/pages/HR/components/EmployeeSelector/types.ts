import { Employee } from '../../types/employee';
import { FormValues } from '../WorkHoursForm';

export interface EmployeeSelectorProps {
  existingEmployees: FormValues[];
  onSelectEmployee: (employee: Employee | null) => void;
}

export interface EmployeeListItemProps {
  employee: Employee;
  onSelect: (employee: Employee) => void;
}

export interface EmptyStateProps {
  isLoading: boolean;
}

export interface ManualEntryOptionProps {
  onAddManually: () => void;
}
