import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileUploadOptions } from './types';

export const useFileValidation = (options: FileUploadOptions = {}) => {
  const {
    maxFiles = 15,
    maxSizeInMB = 25,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'],
  } = options;

  const { toast } = useToast();

  const validateFiles = (files: File[]): File[] => {
    if (files.length > maxFiles) {
      toast({
        variant: 'destructive',
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} files at once.`,
      });
      return [];
    }

    return files.filter((file) => {
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

  return { validateFiles };
};
