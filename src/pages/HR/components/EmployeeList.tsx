
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
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface EmployeeListProps {
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeSelect?: (employee: Employee) => void;
  filterText?: string;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  isLoading = false,
  onEmployeeSelect,
  filterText = ''
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [localFilterText, setLocalFilterText] = useState(filterText);

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
    emp.fullName.toLowerCase().includes(localFilterText.toLowerCase()) ||
    emp.position.toLowerCase().includes(localFilterText.toLowerCase()) ||
    (emp.companyName && emp.companyName.toLowerCase().includes(localFilterText.toLowerCase()))
  );
  const {t} = useLanguage()

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('hr.index.table.full-name')}</TableHead>
              <TableHead>{t('hr.index.table.position')}</TableHead>
              <TableHead>{t('hr.index.table.status')}</TableHead>
              <TableHead>{t('hr.index.table.start-date')}</TableHead>
              <TableHead>{t('hr.index.table.end-date')}</TableHead>
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
                <TableHead>{t('hr.index.table.full-name')}</TableHead>
                <TableHead>{t('hr.index.table.position')}</TableHead>
                <TableHead>{t('hr.index.table.status')}</TableHead>
                <TableHead>{t('hr.index.table.start-date')}</TableHead>
                <TableHead>{t('hr.index.table.end-date')}</TableHead>
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
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <TableCell className="font-medium">
                      {needsTruncation(employee.fullName) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{truncateFileName(employee.fullName)}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {employee.fullName}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        employee.fullName
                      )}
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge className={employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                        {employee.status === 'active' ? t('hr.index.status.active') : t('hr.index.status.terminated')}
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
                            <p>{t('hr.index.button.view-details')}</p>
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
