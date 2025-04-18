
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { WorkHoursData } from '../hooks/useEmployeeWorkHours';
import EmployeeSelector from './EmployeeSelector/EmployeeSelector';
import { format } from 'date-fns';

interface InlineWorkHoursTableProps {
  employeeData: WorkHoursData[];
  onSave: (data: Partial<WorkHoursData>) => Promise<void>;
  onDelete?: (id: string) => void;
  loading?: boolean;
  isSubmitted?: boolean;
}

export const InlineWorkHoursTable: React.FC<InlineWorkHoursTableProps> = ({
  employeeData,
  onSave,
  onDelete,
  loading = false,
  isSubmitted = false
}) => {
  const [editingRow, setEditingRow] = useState<Partial<WorkHoursData> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(!employeeData.length);

  const handleEmployeeSelect = async (employee: any) => {
    if (employee) {
      const newEmployee: Partial<WorkHoursData> = {
        employeeId: employee.id,
        employeeName: employee.fullName,
        companyName: employee.companyName || '',
        grossSalary: 0,
        absenceDays: 0
      };
      await onSave(newEmployee);
      setIsAddingNew(false);
    }
  };

  const handleInputChange = (
    id: string | undefined,
    field: keyof WorkHoursData,
    value: string | number
  ) => {
    if (!id) return;

    const rowData = employeeData.find(row => row.id === id);
    if (!rowData) return;

    const updatedData = {
      ...rowData,
      [field]: field === 'grossSalary' ? parseFloat(value as string) : 
               field === 'absenceDays' ? parseInt(value as string, 10) : 
               field === 'medicalLeaveDate' ? value : 
               value
    };

    onSave(updatedData);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee Name</TableHead>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>Gross Salary</TableHead>
            <TableHead className="w-[120px]">Absence Days</TableHead>
            <TableHead className="w-[150px]">Medical Leave</TableHead>
            {!isSubmitted && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading employee data...
              </TableCell>
            </TableRow>
          ) : employeeData.length === 0 && !isAddingNew ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No employee data found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {employeeData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeName}</TableCell>
                  <TableCell>{employee.companyName || '-'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={employee.grossSalary}
                      onChange={(e) => handleInputChange(employee.id, 'grossSalary', e.target.value)}
                      className="w-[120px]"
                      disabled={isSubmitted}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={employee.absenceDays || 0}
                      onChange={(e) => handleInputChange(employee.id, 'absenceDays', e.target.value)}
                      className="w-[80px]"
                      disabled={isSubmitted}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={employee.medicalLeaveDate ? format(new Date(employee.medicalLeaveDate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => handleInputChange(employee.id, 'medicalLeaveDate', e.target.value)}
                      className="w-[140px]"
                      disabled={isSubmitted}
                    />
                  </TableCell>
                  {!isSubmitted && onDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => employee.id && onDelete(employee.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {isAddingNew && !isSubmitted && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <EmployeeSelector
                      existingEmployees={employeeData}
                      onSelectEmployee={handleEmployeeSelect}
                    />
                  </TableCell>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>

      {!isSubmitted && !isAddingNew && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsAddingNew(true)}
        >
          Add another employee
        </Button>
      )}
    </div>
  );
};
