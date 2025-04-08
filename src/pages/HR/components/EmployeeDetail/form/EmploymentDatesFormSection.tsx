
import React from 'react';
import { Employee } from '../../../types/employee';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmploymentDatesFormSectionProps {
  formData: Employee;
  errors: Partial<Record<keyof Employee, string>>;
  handleStartDateChange: (date: Date | undefined) => void;
  handleEndDateChange: (date: Date | undefined) => void;
}

const EmploymentDatesFormSection: React.FC<EmploymentDatesFormSectionProps> = ({
  formData,
  errors,
  handleStartDateChange,
  handleEndDateChange,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Employment Dates</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                  errors.startDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(new Date(formData.startDate), 'PPP') : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={handleStartDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground",
                  errors.endDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(new Date(formData.endDate), 'PPP') : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate ? new Date(formData.endDate) : undefined}
                onSelect={handleEndDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => {
                  if (!formData.startDate) return false;
                  return date < new Date(formData.startDate);
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmploymentDatesFormSection;
