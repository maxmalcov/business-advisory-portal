
import { useFileUpload, FileUploadOptions } from '@/hooks/fileUpload';

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const uploadConfig = {
    bucketName: 'invoices',
    folderPath: 'sale-invoices',
    invoiceType: 'sale' as const
  };
  
  return useFileUpload(options, uploadConfig);
};

export type { FileUploadOptions };
