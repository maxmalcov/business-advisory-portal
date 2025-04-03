
export interface Invoice {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'pending' | 'rejected';
  size: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    fileName: 'Invoice_2023_001.pdf',
    uploadDate: '2023-10-15',
    status: 'processed',
    size: '1.2 MB',
  },
  {
    id: '2',
    fileName: 'Invoice_2023_002.pdf',
    uploadDate: '2023-10-20',
    status: 'processed',
    size: '0.8 MB',
  },
  {
    id: '3',
    fileName: 'Invoice_2023_003.pdf',
    uploadDate: '2023-11-01',
    status: 'pending',
    size: '1.5 MB',
  },
  {
    id: '4',
    fileName: 'Invoice_2023_004.jpg',
    uploadDate: '2023-11-05',
    status: 'rejected',
    size: '2.1 MB',
  },
  {
    id: '5',
    fileName: 'Invoice_2023_005.pdf',
    uploadDate: '2023-11-10',
    status: 'pending',
    size: '0.9 MB',
  },
];
