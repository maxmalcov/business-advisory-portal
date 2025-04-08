
import React from 'react';
import { Loader2, FileUp, FileX, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
  isLoading: boolean;
  uploadProgress?: number;
  uploadComplete?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  onUpload,
  isLoading,
  uploadProgress = 0,
  uploadComplete = false
}) => {
  if (files.length === 0) return null;

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
              disabled={isLoading}
            >
              <FileX className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {uploadComplete ? 'Processing complete' : 'Uploading files...'}
            </p>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={onUpload}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            {uploadComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" /> 
                Upload Complete
              </>
            ) : (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Uploading...
              </>
            )}
          </span>
        ) : (
          `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`
        )}
      </Button>
    </div>
  );
};

export default FileList;
