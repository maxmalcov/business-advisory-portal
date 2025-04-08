
import { useState } from 'react';
import { useFileValidation } from './useFileValidation';
import { FileUploadOptions } from './types';

export const useFileSelection = (options: FileUploadOptions = {}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { validateFiles } = useFileValidation(options);

  const handleFiles = (fileList: FileList | null, onValidFilesSelected: (files: File[]) => void, append: boolean = false) => {
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      // Either append to existing files or replace them
      if (append) {
        // Check for duplicates by file name and size (simple deduplication)
        const existingFileKeys = new Set(
          selectedFiles.map(file => `${file.name}-${file.size}`)
        );
        
        // Filter out duplicates
        const uniqueNewFiles = validFiles.filter(
          file => !existingFileKeys.has(`${file.name}-${file.size}`)
        );
        
        const updatedFiles = [...selectedFiles, ...uniqueNewFiles];
        setSelectedFiles(updatedFiles);
        onValidFilesSelected(uniqueNewFiles); // Only upload the new files
      } else {
        setSelectedFiles(validFiles);
        onValidFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    onValidFilesSelected: (files: File[]) => void,
    append: boolean = false
  ) => {
    handleFiles(e.target.files, onValidFilesSelected, append);
    // Reset the file input to allow selecting the same file again
    e.target.value = '';
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
    onValidFilesSelected: (files: File[]) => void,
    append: boolean = false
  ) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files, onValidFilesSelected, append);
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
