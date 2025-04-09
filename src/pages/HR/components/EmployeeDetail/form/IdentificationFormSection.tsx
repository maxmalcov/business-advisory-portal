
import React from 'react';
import { Employee } from '../../../types/employee';
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
      <h3 className="text-sm font-medium text-muted-foreground">Identification</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dniTie" className="text-foreground">DNI/TIE</Label>
          <Input
            id="dniTie"
            name="dniTie"
            value={formData.dniTie || ''}
            onChange={handleInputChange}
            className="bg-background text-foreground border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument" className="text-foreground">ID Document</Label>
          <div className="flex">
            <Input
              id="idDocument"
              name="idDocument"
              value={formData.idDocument || ''}
              onChange={handleInputChange}
              disabled
              className="flex-1 bg-background text-foreground border-border"
            />
            <Button type="button" variant="outline" className="ml-2">
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Document upload is not available in edit mode</p>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFormSection;
