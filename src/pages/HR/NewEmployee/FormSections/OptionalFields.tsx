import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { HelpCircle } from 'lucide-react';
import { FormData } from '../types';

interface OptionalFieldsProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSalaryTypeChange: (type: 'gross' | 'net') => void;
}

const OptionalFields: React.FC<OptionalFieldsProps> = ({
  formData,
  handleInputChange,
  handleSalaryTypeChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold border-b pb-1">Optional Information</h3>

      {/* Salary */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="salary">{t('hr.new_employee.salary')}</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Salary Information</h4>
                <p className="text-sm">
                  If not specified, we will calculate the minimum legal salary.
                  Choose whether the amount is gross (before taxes) or net (what
                  the employee receives).
                </p>
                <p className="text-sm font-medium">
                  NET salary is the amount which the worker receives in their
                  bank account after taxes.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex gap-2">
          <Input
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Enter amount in EUR"
            className="flex-1"
          />
          <div className="flex rounded-md border bg-background">
            <Button
              type="button"
              variant={formData.salaryType === 'gross' ? 'default' : 'outline'}
              className="rounded-r-none flex-1 px-3"
              onClick={() => handleSalaryTypeChange('gross')}
            >
              Gross
            </Button>
            <Button
              type="button"
              variant={formData.salaryType === 'net' ? 'default' : 'outline'}
              className="rounded-l-none flex-1 px-3"
              onClick={() => handleSalaryTypeChange('net')}
            >
              Net
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Optional. If left empty, minimum legal salary will be applied.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IBAN */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="iban">{t('hr.new_employee.iban')}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Bank account number for salary payments.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="iban"
            name="iban"
            value={formData.iban}
            onChange={handleInputChange}
            placeholder="ES00 0000 0000 0000 0000 0000"
          />
        </div>

        {/* Employee Email */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="employeeEmail">{t('hr.new_employee.email')}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Employee's personal or professional email address.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="employeeEmail"
            name="employeeEmail"
            type="email"
            value={formData.employeeEmail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="address">{t('hr.new_employee.address')}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Employee's current residential address.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Street, City, Postal Code, Country"
        />
      </div>

      {/* Additional Comments */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="comments">{t('hr.new_employee.comments')}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                Any additional information or special considerations for this
                employee.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default OptionalFields;
