
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export interface EmployeeRecord {
  id: string;
  companyName: string;
  employeeName: string;
  grossSalary: number;
  notes: string;
  absenceDays: number;
  medicalLeaveDate: string | null;
}

interface WorkHoursTableProps {
  employeeData: EmployeeRecord[];
  onEdit: (employee: EmployeeRecord) => void;
  onDelete: (id: string) => void;
}

const WorkHoursTable: React.FC<WorkHoursTableProps> = ({
  employeeData,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Gross Salary</TableHead>
          <TableHead>Absence Days</TableHead>
          <TableHead>Medical Leave</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employeeData.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.companyName}</TableCell>
            <TableCell>{employee.employeeName}</TableCell>
            <TableCell>${employee.grossSalary}</TableCell>
            <TableCell>{employee.absenceDays}</TableCell>
            <TableCell>{employee.medicalLeaveDate || 'N/A'}</TableCell>
            <TableCell>{employee.notes}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(employee)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(employee.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        
        {employeeData.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
              No records found matching your search criteria.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default WorkHoursTable;
