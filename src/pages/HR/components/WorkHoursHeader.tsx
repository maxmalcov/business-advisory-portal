
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileUp, Plus } from 'lucide-react';
import { EmployeeRecord } from './WorkHoursTable';
import ExportButton from './ExportButton';

interface WorkHoursHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  submitToHR: () => void;
  employeeData: EmployeeRecord[];
}

const WorkHoursHeader: React.FC<WorkHoursHeaderProps> = ({
  isAddingNew,
  setIsAddingNew,
  submitToHR,
  employeeData
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h2 className="text-lg font-semibold">Employee Work Hours</h2>
        <p className="text-sm text-muted-foreground">
          Manage monthly work hours for your employees
        </p>
      </div>
      
      <div className="flex gap-2">
        <ExportButton
          data={employeeData}
          fileName="employee-work-hours"
        />
      </div>
    </div>
  );
};

export default WorkHoursHeader;
