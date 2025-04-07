
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
}

const TerminationDatePicker = ({
  terminationDate,
  setTerminationDate,
  isDatePickerOpen,
  setIsDatePickerOpen
}: TerminationDatePickerProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="terminationDate">{t('hr.termination.date')}</Label>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
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
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TerminationDatePicker;
