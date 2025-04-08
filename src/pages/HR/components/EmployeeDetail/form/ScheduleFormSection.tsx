
import React from 'react';
import { Employee } from '../../../types/employee';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ScheduleFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ScheduleFormSection: React.FC<ScheduleFormSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
      <div className="space-y-2">
        <Label htmlFor="weeklySchedule">Weekly Working Schedule</Label>
        <Textarea
          id="weeklySchedule"
          name="weeklySchedule"
          value={formData.weeklySchedule || ''}
          onChange={handleInputChange}
          placeholder="E.g., Monday-Friday: 9:00-17:00"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ScheduleFormSection;
