import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext.tsx';

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
  // States to manage popover open/close
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Safe format function that handles undefined dates
  const formatSafeDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  // Handlers to select date and close popover
  const handleStartDateSelect = (date: Date | undefined) => {
    handleStartDateChange(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    handleEndDateChange(date);
    setEndDateOpen(false);
  };

  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">
        {t('hr.index.employee.detail-from.date')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            {t('hr.index.employee.detail-from.date.start')}
          </Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.startDate && 'text-muted-foreground',
                  errors.startDate && 'border-red-500',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatSafeDate(formData.startDate) || 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onSelect={handleStartDateSelect}
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
          <Label htmlFor="endDate">
            {t('hr.index.employee.detail-from.date.end')}
          </Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.endDate && 'text-muted-foreground',
                  errors.endDate && 'border-red-500',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatSafeDate(formData.endDate) || 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onSelect={handleEndDateSelect}
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
