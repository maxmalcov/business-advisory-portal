
import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaleFileUploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: () => void;
  isLoading?: boolean;
}

const SaleFileUploadArea: React.FC<SaleFileUploadAreaProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  isLoading = false,
}) => {
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground mb-2">
        Drag and drop files here, or click to browse
      </p>
      <Button
        variant="outline"
        onClick={onFileSelect}
        disabled={isLoading}
      >
        Select Files
      </Button>
    </div>
  );
};

export default SaleFileUploadArea;
