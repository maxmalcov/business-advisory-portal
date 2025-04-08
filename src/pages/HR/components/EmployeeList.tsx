
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
  onEmployeeSelect
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
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
      console.log('Opening employee details for ID:', employee.id);
      setSelectedEmployeeId(employee.id);
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
    <div className="flex flex-col space-y-4">
      <div className="mb-2">
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
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No employees found</TableCell>
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
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmployeeClick(employee);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="View employee details"
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
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
      
      <EmployeeDetailDialog 
        employeeId={selectedEmployeeId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
};

export default EmployeeList;
