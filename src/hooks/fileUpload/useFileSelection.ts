
import { useState } from 'react';
import { useFileValidation } from './useFileValidation';
import { FileUploadOptions } from './types';

export const useFileSelection = (options: FileUploadOptions = {}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { validateFiles } = useFileValidation(options);

  const handleFiles = (fileList: FileList | null, onValidFilesSelected: (files: File[]) => void) => {
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onValidFilesSelected(validFiles);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    onValidFilesSelected: (files: File[]) => void
  ) => {
    handleFiles(e.target.files, onValidFilesSelected);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onValidFilesSelected: (files: File[]) => void
  ) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files, onValidFilesSelected);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  const resetFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    resetFiles,
  };
};
