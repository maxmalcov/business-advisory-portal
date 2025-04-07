
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmployeeData } from '../types';

interface EmployeeInfoCardProps {
  selectedEmployeeData: EmployeeData | undefined;
  additionalVacationDays: string;
}

const EmployeeInfoCard = ({ selectedEmployeeData, additionalVacationDays }: EmployeeInfoCardProps) => {
  const { t } = useLanguage();
  
  if (!selectedEmployeeData) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Select an employee to view their information</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
        <p className="font-medium">{selectedEmployeeData.name}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
        <p>{selectedEmployeeData.position}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
        <p>{format(selectedEmployeeData.startDate, 'PPP')}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Vacation Days</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{selectedEmployeeData.vacationDaysTotal}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('hr.termination.vacation')}</TableCell>
              <TableCell>{selectedEmployeeData.vacationDaysUsed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Remaining</TableCell>
              <TableCell>{selectedEmployeeData.vacationDaysTotal - selectedEmployeeData.vacationDaysUsed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Additional</TableCell>
              <TableCell>{Number(additionalVacationDays) || 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
