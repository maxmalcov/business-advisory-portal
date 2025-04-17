
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { WorkHoursData } from '../hooks/useEmployeeWorkHours';
import { exportWorkHoursToCsv } from '@/utils/csvExport';

interface WorkHoursHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
  submitToHR: () => Promise<void>;
  employeeData: WorkHoursData[];
  selectedMonth: Date;
}

export const WorkHoursHeader: React.FC<WorkHoursHeaderProps> = ({
  isAddingNew,
  setIsAddingNew,
  submitToHR,
  employeeData,
  selectedMonth,
}) => {
  const handleExportCsv = () => {
    exportWorkHoursToCsv(employeeData, selectedMonth);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={handleExportCsv}
          disabled={employeeData.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};
