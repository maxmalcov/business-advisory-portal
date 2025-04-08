
import React from 'react';
import { format } from 'date-fns';
import { FileUp, FileDown, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceUpload } from './InvoiceHistoryList';

interface InvoiceHistoryTableProps {
  isLoading: boolean;
  invoices: InvoiceUpload[];
  onViewInvoice: (invoice: InvoiceUpload) => void;
  onDownloadInvoice: (invoice: InvoiceUpload) => void;
}

const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
  isLoading,
  invoices,
  onViewInvoice,
  onDownloadInvoice
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading invoice history...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="bg-muted py-2 px-4 grid grid-cols-7 text-sm font-medium">
        <div className="col-span-2">File Name</div>
        <div>Type</div>
        <div>Upload Date</div>
        <div>Sent To</div>
        <div>Sent At</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="divide-y">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="grid grid-cols-7 py-3 px-4 items-center text-sm"
            >
              <div className="col-span-2 flex items-center">
                {invoice.invoice_type === 'sale' ? (
                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                <span className="truncate" title={invoice.file_name}>{invoice.file_name}</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.invoice_type === 'sale' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                }`}>
                  {invoice.invoice_type === 'sale' ? 'Sales' : 'Supplier'}
                </span>
              </div>
              <div title={invoice.created_at}>
                {format(new Date(invoice.created_at), 'MMM d, yyyy')}
              </div>
              <div className="truncate" title={invoice.sent_to_email || 'Not sent'}>
                {invoice.sent_to_email || 'Not sent'}
              </div>
              <div>
                {invoice.sent_at 
                  ? format(new Date(invoice.sent_at), 'MMM d, yyyy') 
                  : 'Not sent'}
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  title="View Invoice"
                  onClick={() => onViewInvoice(invoice)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  title="Download Invoice"
                  onClick={() => onDownloadInvoice(invoice)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            No invoices found.
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceHistoryTable;
