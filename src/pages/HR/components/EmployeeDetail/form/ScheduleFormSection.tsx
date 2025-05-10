import React from 'react';
import { Employee } from '../../../types/employee';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

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
      <h3 className="text-sm font-medium text-muted-foreground">Schedule</h3>

      <Card className="border border-border">
        <CardContent className="pt-4 bg-card">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <Label
                htmlFor="weeklySchedule"
                className="text-base text-foreground"
              >
                Weekly Working Schedule
              </Label>
              <div className="flex items-center text-muted-foreground text-xs">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>Please enter the full weekly schedule</span>
              </div>
            </div>

            <Textarea
              id="weeklySchedule"
              name="weeklySchedule"
              value={formData.weeklySchedule || ''}
              onChange={handleInputChange}
              placeholder="E.g., Monday-Friday: 9:00-17:00, Saturday: 9:00-13:00"
              rows={4}
              className="resize-none bg-background text-foreground border-border"
            />

            <div className="text-xs text-muted-foreground mt-1">
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Monday-Friday: 9:00-17:00</li>
                <li>Mon, Wed, Fri: 8:00-15:00 / Tue, Thu: 12:00-20:00</li>
                <li>Flexible schedule: 40 hours per week</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleFormSection;
