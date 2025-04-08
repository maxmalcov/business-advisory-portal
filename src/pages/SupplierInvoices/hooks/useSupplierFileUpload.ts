
import { useBaseFileUpload, FileUploadOptions } from '@/hooks/useBaseFileUpload';

export const useSupplierFileUpload = (options: FileUploadOptions = {}) => {
  const uploadConfig = {
    bucketName: 'invoices',
    folderPath: 'supplier-invoices',
    invoiceType: 'supplier' as const
  };
  
  return useBaseFileUpload(options, uploadConfig);
};

export type { FileUploadOptions };
