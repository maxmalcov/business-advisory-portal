import { useFileUpload, FileUploadOptions } from '@/hooks/fileUpload';

export const useInvoiceFileUpload = (options: FileUploadOptions = {}) => {
  const uploadConfig = {
    bucketName: 'invoices',
    folderPath: 'sale-invoices',
    invoiceType: 'sale' as const,
  };

  return useFileUpload(options, uploadConfig);
};

export type { FileUploadOptions };
