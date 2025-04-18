
import React from 'react';
import { format } from 'date-fns';
import { FileUp, FileDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InvoiceHistoryTableProps } from './types';
import { needsTruncation, truncateFileName } from '@/utils/fileUtils';
import { InvoiceTypeTag } from './InvoiceTypeTag';
import { InvoiceActions } from './InvoiceActions';

export const InvoiceHistoryMobile: React.FC<InvoiceHistoryTableProps> = ({
  invoices,
  onViewInvoice,
  onDownloadInvoice,
}) => {
  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="border rounded-md p-4 bg-card">
          <div className="flex items-center mb-3">
            {invoice.invoice_type === 'sale' ? (
              <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
            ) : (
              <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            <div className="font-medium flex-1 break-all">
              {needsTruncation(invoice.file_name) ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateFileName(invoice.file_name)}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px]">
                      {invoice.file_name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span>{invoice.file_name}</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2">
                <InvoiceTypeTag type={invoice.invoice_type} />
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2" title={invoice.created_at}>
                {format(new Date(invoice.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
            <InvoiceActions
              invoice={invoice}
              onView={onViewInvoice}
              onDownload={onDownloadInvoice}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

