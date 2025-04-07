
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreHorizontal, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Employee } from '../types/employee';
import EmployeeDetailDialog from './EmployeeDetailDialog';
import { useEmployeeList } from '../hooks/useEmployeeList';
import EmployeeStatusToggle from './EmployeeStatusToggle';
import FilterInput from './FilterInput';

const EmployeeList: React.FC = () => {
  const { employees, statusFilter, setStatusFilter, isLoading, refreshEmployees } = useEmployeeList();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(filter.toLowerCase()) || 
    emp.position.toLowerCase().includes(filter.toLowerCase()) ||
    (emp.companyName && emp.companyName.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };
  
  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FilterInput value={filter} onChange={setFilter} />
        <EmployeeStatusToggle 
          activeStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Start Date</TableHead>
              {statusFilter === 'terminated' && <TableHead>End Date</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={statusFilter === 'terminated' ? 7 : 6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={statusFilter === 'terminated' ? 7 : 6} className="text-center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.companyName || '-'}</TableCell>
                  <TableCell>{formatDate(employee.startDate)}</TableCell>
                  {statusFilter === 'terminated' && (
                    <TableCell>{formatDate(employee.endDate)}</TableCell>
                  )}
                  <TableCell>
                    <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                      {employee.status === 'active' ? 'Active' : 'Terminated'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <EmployeeDetailDialog 
        employee={selectedEmployee} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onEmployeeUpdated={refreshEmployees}
      />
    </div>
  );
};

export default EmployeeList;
