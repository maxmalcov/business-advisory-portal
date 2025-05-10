import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { FormData, FormErrors } from '../../types';
import { Button } from '@/components/ui/button';

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="idDocument" className="flex items-center">
          ID Document (PDF, JPG or PNG){' '}
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>
              Upload a scanned copy of the employee's identification document.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            ref={inputRef}
            id="idDocument"
            name="idDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={`${errors.idDocument ? 'border-red-500' : ''} hidden`}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={triggerFileInput}
              variant="outline"
              className="flex-1 flex justify-center items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
            {formData.idDocument ? (
              <Input
                value={formData.idDocument.name}
                readOnly
                className="flex-1"
                onClick={triggerFileInput}
              />
            ) : (
              <Input
                value="No file selected"
                readOnly
                className="flex-1 text-muted-foreground"
                onClick={triggerFileInput}
              />
            )}
          </div>
        </div>
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Uploading: {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      {errors.idDocument && (
        <p className="text-sm text-red-500">{errors.idDocument}</p>
      )}
    </div>
  );
};

export default IdDocumentField;
