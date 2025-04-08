
import { useBaseFileUpload, FileUploadOptions } from '@/hooks/useBaseFileUpload';

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const uploadConfig = {
    bucketName: 'invoices',
    folderPath: 'sales-invoices',
    invoiceType: 'sale' as const
  };
  
  return useBaseFileUpload(options, uploadConfig);
};

export type { FileUploadOptions };
