
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormData, FormErrors } from '../../types';

interface CompanyFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyField: React.FC<CompanyFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="companyName" className="flex items-center">
        {t('hr.new_employee.company')} <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input
        id="companyName"
        name="companyName"
        value={formData.companyName}
        onChange={handleInputChange}
        className={errors.companyName ? "border-red-500" : ""}
      />
      {errors.companyName && (
        <p className="text-sm text-red-500">{errors.companyName}</p>
      )}
    </div>
  );
};

export default CompanyField;
