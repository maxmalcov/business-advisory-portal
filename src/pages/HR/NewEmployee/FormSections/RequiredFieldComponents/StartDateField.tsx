
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { CalendarIcon, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormData, FormErrors } from '../../types';

interface StartDateFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleDateChange: (date: Date | undefined) => void;
}

const StartDateField: React.FC<StartDateFieldProps> = ({
  formData,
  errors,
  handleDateChange,
}) => {
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Modified date change handler that closes the popover
  const handleDateSelect = (date: Date | undefined) => {
    handleDateChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="startDate" className="flex items-center">
          {t('hr.new_employee.start_date')} <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>The first day the employee will start working.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !formData.startDate ? "text-muted-foreground" : ""
            } ${errors.startDate ? "border-red-500" : ""}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData.startDate ? format(formData.startDate, "PPP") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formData.startDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errors.startDate && (
        <p className="text-sm text-red-500">{errors.startDate}</p>
      )}
    </div>
  );
};

export default StartDateField;
