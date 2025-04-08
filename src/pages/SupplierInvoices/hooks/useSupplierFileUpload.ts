
import { useFileUpload, FileUploadOptions } from '@/hooks/fileUpload';
import { useCallback } from 'react';

export const useSupplierFileUpload = (options: FileUploadOptions = {}) => {
  const uploadConfig = {
    bucketName: 'invoices',
    folderPath: 'supplier-invoices',
    invoiceType: 'supplier' as const
  };
  
  const baseUploadHook = useFileUpload(options, uploadConfig);

  // Ensure the file change handler is properly connected to the input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    baseUploadHook.handleFileChange(e);
  }, [baseUploadHook.handleFileChange]);

  return {
    ...baseUploadHook,
    handleFileChange
  };
};

export type { FileUploadOptions };
