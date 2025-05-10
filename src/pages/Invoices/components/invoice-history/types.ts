import { InvoiceUpload } from '../InvoiceHistoryList';

export interface InvoiceHistoryTableProps {
  isLoading: boolean;
  invoices: InvoiceUpload[];
  onViewInvoice: (invoice: InvoiceUpload) => void;
  onDownloadInvoice: (invoice: InvoiceUpload) => void;
}

export interface InvoiceActionsProps {
  invoice: InvoiceUpload;
  onView: (invoice: InvoiceUpload) => void;
  onDownload: (invoice: InvoiceUpload) => void;
}

export interface InvoiceTypeTagProps {
  type: 'sale' | 'supplier';
}
