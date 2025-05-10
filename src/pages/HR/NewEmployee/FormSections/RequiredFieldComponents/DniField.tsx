import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { FormData, FormErrors } from '../../types';

interface DniFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const DniField: React.FC<DniFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="employeeDni" className="flex items-center">
          {t('hr.new_employee.dni')}{' '}
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>DNI for Spanish nationals or TIE/NIE for foreign residents.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Input
        id="employeeDni"
        name="employeeDni"
        value={formData.employeeDni}
        onChange={handleInputChange}
        className={errors.employeeDni ? 'border-red-500' : ''}
      />
      {errors.employeeDni && (
        <p className="text-sm text-red-500">{errors.employeeDni}</p>
      )}
    </div>
  );
};

export default DniField;
