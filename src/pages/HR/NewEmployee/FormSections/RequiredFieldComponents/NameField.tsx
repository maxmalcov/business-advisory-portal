
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormData, FormErrors } from '../../types';

interface NameFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const NameField: React.FC<NameFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="fullName" className="flex items-center">
        Full Name <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="e.g., John Doe"
        className={errors.fullName ? "border-red-500" : ""}
      />
      {errors.fullName && (
        <p className="text-sm text-red-500">{errors.fullName}</p>
      )}
    </div>
  );
};

export default NameField;
