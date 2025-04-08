
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TerminationDatePickerProps {
  terminationDate: Date | undefined;
  setTerminationDate: (date: Date | undefined) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  dateError?: string | null;
  employeeStartDate?: string;
}

const TerminationDatePicker = ({
  terminationDate,
  setTerminationDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  dateError,
  employeeStartDate
}: TerminationDatePickerProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="terminationDate">{t('hr.termination.date')}</Label>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${dateError ? 'border-red-500' : ''}`}
            id="terminationDate"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {terminationDate ? format(terminationDate, 'PPP') : <span>Select a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={terminationDate}
            onSelect={(date) => {
              setTerminationDate(date);
              setIsDatePickerOpen(false);
            }}
            initialFocus
            className="p-3 pointer-events-auto"
            disabled={(date) => {
              if (!employeeStartDate) return false;
              // Disable dates before the employee's start date
              return date < new Date(employeeStartDate);
            }}
          />
        </PopoverContent>
      </Popover>
      {dateError && (
        <p className="text-xs text-red-500">{dateError}</p>
      )}
    </div>
  );
};

export default TerminationDatePicker;
