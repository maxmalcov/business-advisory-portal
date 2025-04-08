
export interface SupplierInvoice {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'pending' | 'rejected';
  size: string;
}

export const mockSupplierInvoices: SupplierInvoice[] = [
  {
    id: '1',
    fileName: 'Supplier_Invoice_2023_001.pdf',
    uploadDate: '2023-10-10',
    status: 'processed',
    size: '1.1 MB',
  },
  {
    id: '2',
    fileName: 'Supplier_Invoice_2023_002.pdf',
    uploadDate: '2023-10-25',
    status: 'processed',
    size: '0.7 MB',
  },
  {
    id: '3',
    fileName: 'Supplier_Invoice_2023_003.pdf',
    uploadDate: '2023-11-02',
    status: 'pending',
    size: '1.3 MB',
  },
  {
    id: '4',
    fileName: 'Supplier_Invoice_2023_004.jpg',
    uploadDate: '2023-11-08',
    status: 'rejected',
    size: '2.3 MB',
  },
];
