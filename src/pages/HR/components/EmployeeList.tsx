
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Employee } from '../types/employee';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeDetailDialog from './EmployeeDetailDialog';
import { FilterInput } from './FilterInput';

interface EmployeeListProps {
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeSelect?: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  isLoading = false,
  onEmployeeSelect
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    if (onEmployeeSelect) {
      onEmployeeSelect(employee);
    } else {
      console.log('Opening employee details:', employee); // Add debug log
      setSelectedEmployee(employee);
      setDetailDialogOpen(true);
    }
  };

  // Filter employees based on search text
  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
    emp.position.toLowerCase().includes(filterText.toLowerCase()) ||
    (emp.companyName && emp.companyName.toLowerCase().includes(filterText.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Position/Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <FilterInput 
            value={filterText} 
            onChange={setFilterText} 
            placeholder="Search by name, position, or company..."
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Position/Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No employees found</TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                        {employee.status === 'active' ? 'Active' : 'Terminated'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(employee.startDate)}</TableCell>
                    <TableCell>{employee.endDate ? formatDate(employee.endDate) : '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <EmployeeDetailDialog 
        employee={selectedEmployee}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
};

export default EmployeeList;
