
import React from 'react';
import { Loader2, FileUp, FileX, Check, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadedFile } from '@/hooks/useBaseFileUpload';

interface SupplierFileListProps {
  files: File[];
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
  onSendEmail: () => void;
  onResetUpload: () => void;
  onAddMoreFiles: () => void;
  isLoading: boolean;
  isSending: boolean;
  uploadProgress?: number;
  uploadComplete?: boolean;
  uploadSuccess?: boolean;
  uploadError?: string | null;
}

const SupplierFileList: React.FC<SupplierFileListProps> = ({
  files,
  uploadedFiles,
  onRemoveFile,
  onSendEmail,
  onResetUpload,
  onAddMoreFiles,
  isLoading,
  isSending,
  uploadProgress = 0,
  uploadComplete = false,
  uploadSuccess = false,
  uploadError = null
}) => {
  if (files.length === 0) return null;

  const canSendEmail = uploadComplete && uploadSuccess && uploadedFiles.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Selected Files ({files.length})</h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <div className="flex items-center">
              <FileUp className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveFile(index)}
              disabled={isLoading || isSending}
            >
              <FileX className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {uploadComplete ? (
              uploadSuccess ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            <p className="text-sm text-muted-foreground">
              {uploadComplete 
                ? (uploadSuccess 
                  ? 'Upload complete' 
                  : 'Upload failed')
                : 'Uploading files...'}
            </p>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {uploadError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        {uploadComplete && uploadSuccess ? (
          <Button 
            className="w-full sm:w-auto" 
            variant="outline"
            onClick={onAddMoreFiles}
            disabled={isSending}
          >
            Upload More Files
          </Button>
        ) : (
          <Button 
            className="w-full sm:w-auto" 
            variant="outline"
            onClick={onResetUpload}
            disabled={isSending}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          className="w-full sm:w-auto flex-1" 
          onClick={onSendEmail}
          disabled={!canSendEmail || isSending}
        >
          {isSending ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Sending...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="mr-2 h-4 w-4" /> 
              Send Invoice{files.length > 1 ? 's' : ''} by Email
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SupplierFileList;
