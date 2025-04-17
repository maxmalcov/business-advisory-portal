
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatDate } from '@/utils/dates';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { WorkHoursData } from '../hooks/useEmployeeWorkHours';
import { FilterInput } from './FilterInput';

export interface EmployeeRecord extends WorkHoursData {
  id?: string;
}

interface WorkHoursTableProps {
  employeeData: EmployeeRecord[];
  onEdit?: (employee: EmployeeRecord) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

const WorkHoursTable: React.FC<WorkHoursTableProps> = ({
  employeeData,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [filterText, setFilterText] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  // Filter employees based on search text
  const filteredData = employeeData.filter(employee => {
    const searchText = filterText.toLowerCase();
    return (
      employee.employeeName.toLowerCase().includes(searchText) ||
      (employee.companyName && employee.companyName.toLowerCase().includes(searchText))
    );
  });

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (employeeToDelete && onDelete) {
      onDelete(employeeToDelete);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div>
      {/* Filter input */}
      <div className="mb-4">
        <FilterInput
          value={filterText}
          onChange={setFilterText}
          placeholder="Filter by employee or company name..."
        />
      </div>

      {/* Employee Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Gross Salary</TableHead>
              <TableHead className="text-center">Absence Days</TableHead>
              <TableHead>Medical Leave</TableHead>
              {onEdit && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={onEdit ? 6 : 5} className="h-24 text-center">
                  Loading employee data...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onEdit ? 6 : 5} className="h-24 text-center">
                  No employee data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((employee) => (
                <TableRow key={employee.id || employee.employeeName}>
                  <TableCell className="font-medium">{employee.employeeName}</TableCell>
                  <TableCell>{employee.companyName || '-'}</TableCell>
                  <TableCell className="text-right">
                    {employee.grossSalary.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-center">{employee.absenceDays || 0}</TableCell>
                  <TableCell>
                    {employee.medicalLeaveDate ? formatDate(employee.medicalLeaveDate) : '-'}
                  </TableCell>
                  {onEdit && onDelete && employee.id && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(employee)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setEmployeeToDelete(employee.id!)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this employee's records for the selected month.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkHoursTable;
