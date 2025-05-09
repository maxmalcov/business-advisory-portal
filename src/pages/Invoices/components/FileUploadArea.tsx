import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface FileUploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: () => void;
  isLoading?: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const getTexts = () => {
    return {
      dropHere: t('invoices.drop-area.title'),
      orClickTo: t('invoices.drop-area.click'),
      selectFiles: t('invoices.drop-area.select-files'),
    };
  };

  const texts = getTexts();

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-10 text-center
        transition-all duration-300 ease-in-out
        ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
        }
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
          <p className="text-xl font-medium mb-2">{texts.dropHere}</p>
          <p className="text-muted-foreground">{texts.orClickTo}</p>
        </div>
        <Button
          variant="outline"
          onClick={onFileSelect}
          disabled={isLoading}
          className="mt-4"
        >
          {texts.selectFiles}
        </Button>
      </div>
    </div>
  );
};

export default FileUploadArea;
