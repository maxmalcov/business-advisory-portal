
import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierFileUploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: () => void;
  isLoading?: boolean;
}

const SupplierFileUploadArea: React.FC<SupplierFileUploadAreaProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  isLoading = false,
}) => {
  return (
    <div 
      className={`
        border-2 border-dashed rounded-xl p-10 text-center
        transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
        }
        transition-transform duration-300 transform hover:scale-[1.01]
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <FileUp className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-xl font-medium mb-2">
            Drop your files here
          </p>
          <p className="text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onFileSelect}
          disabled={isLoading}
          className="mt-4"
        >
          Select Files
        </Button>
      </div>
    </div>
  );
};

export default SupplierFileUploadArea;
