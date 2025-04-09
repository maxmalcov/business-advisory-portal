
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { FormData, FormErrors } from '../../types';

interface IdDocumentFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress?: number;
}

const IdDocumentField: React.FC<IdDocumentFieldProps> = ({
  formData,
  errors,
  handleFileChange,
  uploadProgress = 0,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="idDocument" className="flex items-center">
          ID Document (PDF, JPG or PNG) <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Upload a scanned copy of the employee's identification document.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            id="idDocument"
            name="idDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={`${errors.idDocument ? "border-red-500" : ""} cursor-pointer`}
          />
          <label htmlFor="idDocument" className="absolute inset-0 flex items-center justify-center opacity-0">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </label>
        </div>
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">Uploading: {Math.round(uploadProgress)}%</p>
        </div>
      )}
      {errors.idDocument && (
        <p className="text-sm text-red-500">{errors.idDocument}</p>
      )}
      {formData.idDocument && (
        <p className="text-sm text-muted-foreground">
          File: {formData.idDocument.name} 
          ({(formData.idDocument.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default IdDocumentField;
