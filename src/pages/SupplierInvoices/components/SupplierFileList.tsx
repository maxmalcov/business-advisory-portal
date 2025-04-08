
import React from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierFileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
  isLoading: boolean;
}

const SupplierFileList: React.FC<SupplierFileListProps> = ({
  files,
  onRemoveFile,
  onUpload,
  isLoading,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Selected Files ({files.length})</h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <div className="flex items-center">
              <FileDown className="h-5 w-5 mr-2 text-muted-foreground" />
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
              &times;
            </Button>
          </div>
        ))}
      </div>
      <Button 
        className="w-full" 
        onClick={onUpload}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
      </Button>
    </div>
  );
};

export default SupplierFileList;
