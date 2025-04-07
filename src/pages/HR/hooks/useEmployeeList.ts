
import { useState, useMemo } from 'react';
import { Employee, EmployeeStatus } from '../types/employee';

// Mock data - in a real app, this would come from an API or database
const mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'John Doe',
    position: 'Software Engineer',
    status: 'active',
    startDate: '2023-01-15',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    position: 'Product Manager',
    status: 'active',
    startDate: '2022-05-10',
  },
  {
    id: '3',
    fullName: 'Robert Johnson',
    position: 'UX Designer',
    status: 'terminated',
    startDate: '2021-03-22',
    endDate: '2023-08-15',
  },
  {
    id: '4',
    fullName: 'Emily Wilson',
    position: 'Marketing Specialist',
    status: 'active',
    startDate: '2023-02-01',
  },
  {
    id: '5',
    fullName: 'Michael Brown',
    position: 'Data Analyst',
    status: 'terminated',
    startDate: '2022-01-05',
    endDate: '2023-07-30',
  }
];

export function useEmployeeList() {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus>('active');
  
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(employee => employee.status === statusFilter);
  }, [statusFilter]);

  return {
    employees: filteredEmployees,
    statusFilter,
    setStatusFilter
  };
}
