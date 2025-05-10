import React from 'react';
import { Employee, EmployeeStatus } from '../../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface BasicInfoFormSectionProps {
  formData: Employee;
  errors: Partial<Record<keyof Employee, string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (value: EmployeeStatus) => void;
}

const BasicInfoFormSection: React.FC<BasicInfoFormSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  handleStatusChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">
        {t('hr.index.employee.detail-from.basic-info')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {t('hr.index.employee.detail-from.full-name')}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            {t('hr.index.employee.detail-from.position')}
          </Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={errors.position ? 'border-red-500' : ''}
          />
          {errors.position && (
            <p className="text-xs text-red-500">{errors.position}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">
            {t('hr.index.employee.detail-from.company')}
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('hr.index.employee.detail-from.status')}</Label>
          <RadioGroup
            value={formData.status}
            onValueChange={(value) =>
              handleStatusChange(value as EmployeeStatus)
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active" className="cursor-pointer">
                {t('hr.index.status.active')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="terminated" id="terminated" />
              <Label htmlFor="terminated" className="cursor-pointer">
                {t('hr.index.status.terminated')}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoFormSection;
