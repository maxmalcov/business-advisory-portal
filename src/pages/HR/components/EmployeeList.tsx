
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
import { Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmployeeListProps {
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeSelect?: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  isLoading = false,
  onEmployeeSelect,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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
      console.log('Opening employee details for ID:', employee.id);
      setSelectedEmployeeId(employee.id);
      setDetailDialogOpen(true);
    }
  };

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
              <TableHead className="w-[60px]"></TableHead>
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
                <TableCell><Skeleton className="h-5 w-[30px]" /></TableCell>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Position/Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No employees found</TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
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
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmployeeClick(employee);
                              }}
                              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted/60 transition-colors"
                              aria-label="View employee details"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <EmployeeDetailDialog 
        employeeId={selectedEmployeeId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
};

export default EmployeeList;
