
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EmployeeRecord } from './WorkHoursTable';

interface ExportButtonProps {
  data: any;
  selectedMonth: Date;
  fileName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data,
  selectedMonth,
  fileName = 'work-hours-data'
}) => {
  const exportToCSV = () => {
    // Define the column headers
    const headers = [
      'Company', 
      'Employee', 
      'Gross Salary', 
      'Absence Days', 
      'Medical Leave', 
      'Notes'
    ];
    
    // Map the data to a CSV-friendly format
    const csvData = data.map(item => [
      item.company_name || '',
      item.employee_name,
      item.gross_salary,
      (item.absence_days || 0).toString(),
      item.medical_leave_date || 'N/A',
      (item.notes || '').replace(/,/g, ';') // Replace any commas in notes with semicolons to avoid CSV issues
    ]);
    
    // Combine headers with data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}-${selectedMonth.getFullYear()}-0${selectedMonth.getMonth()+1}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={exportToCSV}
      className="flex items-center gap-2"
    >
      <Download size={16} />
      Export CSV
    </Button>
  );
};

export default ExportButton;
