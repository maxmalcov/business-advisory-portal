
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Plus } from 'lucide-react';
import ExportButton from './ExportButton';

interface WorkHoursCardHeaderProps {
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  submitToHR: () => void;
  employeeData: any[];
  selectedMonth: Date;
}

const WorkHoursCardHeader: React.FC<WorkHoursCardHeaderProps> = ({
  isAddingNew,
  setIsAddingNew,
  submitToHR,
  employeeData,
    selectedMonth
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        {/* Paragraph text removed as per user request */}
      </div>
      
      <div className="flex gap-2">
      {/*{employeeData.length > 0 && (*/}
      {/*    <Button*/}
      {/*        variant="default"*/}
      {/*        onClick={submitToHR}*/}
      {/*        className="flex items-center gap-1"*/}
      {/*    >*/}
      {/*        <FileUp size={16} />*/}
      {/*        Submit to HR*/}
      {/*    </Button>*/}
      {/*)}*/}
        <ExportButton
          data={employeeData}
          fileName="employee-work-hours"
          selectedMonth={selectedMonth}
        />
        
        {/*{!isAddingNew && (*/}
        {/*  <Button */}
        {/*    variant="outline" */}
        {/*    onClick={() => setIsAddingNew(true)}*/}
        {/*    className="flex items-center gap-1"*/}
        {/*  >*/}
        {/*    <Plus size={16} />*/}
        {/*    Add Employee*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default WorkHoursCardHeader;
