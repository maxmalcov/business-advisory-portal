
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FileUploadOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export const useSupplierFileUpload = (options: FileUploadOptions = {}) => {
  const {
    maxFiles = 15,
    maxSizeInMB = 25,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'],
  } = options;
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateFiles = (files: File[]): File[] => {
    // Check number of files
    if (files.length > maxFiles) {
      toast({
        variant: 'destructive',
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} files at once.`,
      });
      return [];
    }
    
    // Check file types and sizes
    return files.filter(file => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;
      
      if (!isValidType) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type.`,
        });
      }
      
      if (!isValidSize) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds the ${maxSizeInMB}MB limit.`,
        });
      }
      
      return isValidType && isValidSize;
    });
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    isDragging,
    isLoading,
    setIsLoading,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    resetFiles,
  };
};
