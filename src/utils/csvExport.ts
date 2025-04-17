
import { WorkHoursData } from '@/pages/HR/hooks/useEmployeeWorkHours';
import { formatMonthYear } from './dates';

export const exportWorkHoursToCsv = (
  workHours: WorkHoursData[], 
  selectedMonth: Date
) => {
  // Prepare CSV headers
  const headers = [
    'Employee Name', 
    'Company', 
'Company Name',
    'Gross Salary', 
    'Absence Days', 
    'Medical Leave Date', 
    'Notes'
  ];

  // Convert work hours to CSV rows
  const rows = workHours.map(employee => [
    employee.employeeName,
    employee.employeeId || '',
    employee.companyName || '',
    employee.grossSalary.toString(),
    (employee.absenceDays || 0).toString(),
    employee.medicalLeaveDate || '',
    employee.notes || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => 
      // Properly escape CSV fields
      `"${cell.replace(/"/g, '""')}"`
    ).join(','))
  ].join('\n');

  // Create and trigger CSV download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `work_hours_${formatMonthYear(selectedMonth)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
