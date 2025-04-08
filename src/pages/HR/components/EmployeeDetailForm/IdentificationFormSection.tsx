
import React from 'react';
import { Employee } from '../../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface IdentificationFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentificationFormSection: React.FC<IdentificationFormSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Identification</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dniTie">DNI/TIE</Label>
          <Input
            id="dniTie"
            name="dniTie"
            value={formData.dniTie || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument">ID Document</Label>
          <div className="flex">
            <Input
              id="idDocument"
              name="idDocument"
              value={formData.idDocument || ''}
              onChange={handleInputChange}
              disabled
              className="flex-1"
            />
            <Button type="button" variant="outline" className="ml-2">
              Upload
            </Button>
          </div>
          <p className="text-xs text-gray-500">Document upload is not available in edit mode</p>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFormSection;
