
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { FormData, FormErrors } from '../../types';

interface PositionFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PositionField: React.FC<PositionFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="position" className="flex items-center">
          {t('hr.new_employee.position')} <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>The employee's job title or role within the company.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Input
        id="position"
        name="position"
        value={formData.position}
        onChange={handleInputChange}
        className={errors.position ? "border-red-500" : ""}
      />
      {errors.position && (
        <p className="text-sm text-red-500">{errors.position}</p>
      )}
    </div>
  );
};

export default PositionField;
