
import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IDDocumentDisplay, DocumentUploader } from './Identification';

interface IdentificationFormSectionProps {
  formData: Employee;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateDocument?: (documentPath: string) => void;
}

const IdentificationFormSection: React.FC<IdentificationFormSectionProps> = ({
  formData,
  handleInputChange,
  updateDocument
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDocumentUploaded = (filePath: string) => {
    if (updateDocument) {
      updateDocument(filePath);
    }
  };

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
          <div className="flex flex-col gap-2">
            <IDDocumentDisplay documentPath={formData.idDocument} />
            
            <DocumentUploader 
              onDocumentUploaded={handleDocumentUploaded}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              setIsUploading={setIsUploading}
              setUploadProgress={setUploadProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFormSection;
