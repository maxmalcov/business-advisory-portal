
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { FormData, FormErrors } from '../../types';

interface ScheduleFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ScheduleField: React.FC<ScheduleFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="schedule" className="flex items-center">
          {t('hr.new_employee.schedule')} <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Specify working days and hours, including breaks if applicable.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Input
        id="schedule"
        name="schedule"
        value={formData.schedule}
        onChange={handleInputChange}
        placeholder="e.g., Monday-Friday, 9:00-17:00"
        className={errors.schedule ? "border-red-500" : ""}
      />
      {errors.schedule && (
        <p className="text-sm text-red-500">{errors.schedule}</p>
      )}
      <p className="text-sm text-muted-foreground">
        {t('hr.new_employee.days_off')}
      </p>
    </div>
  );
};

export default ScheduleField;
