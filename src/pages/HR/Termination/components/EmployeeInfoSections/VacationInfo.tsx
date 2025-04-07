
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmployeeData } from '../../types';

interface VacationInfoProps {
  employeeData: EmployeeData;
  additionalVacationDays: string;
}

const VacationInfo = ({ employeeData, additionalVacationDays }: VacationInfoProps) => {
  const { t } = useLanguage();
  
  return (
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
            <TableCell>{employeeData.vacationDaysTotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('hr.termination.vacation')}</TableCell>
            <TableCell>{employeeData.vacationDaysUsed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Remaining</TableCell>
            <TableCell>{employeeData.vacationDaysTotal - employeeData.vacationDaysUsed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Additional</TableCell>
            <TableCell>{Number(additionalVacationDays) || 0}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default VacationInfo;
