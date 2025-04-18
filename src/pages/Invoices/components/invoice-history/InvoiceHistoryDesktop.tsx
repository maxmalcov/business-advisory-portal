
import React from 'react';
import { format } from 'date-fns';
import { FileUp, FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

export const InvoiceHistoryDesktop: React.FC<InvoiceHistoryTableProps> = ({
  invoices,
  onViewInvoice,
  onDownloadInvoice,
}) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {invoice.invoice_type === 'sale' ? (
                    <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  {needsTruncation(invoice.file_name) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate max-w-[300px] inline-block">
                            {truncateFileName(invoice.file_name)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[300px]">
                          {invoice.file_name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="truncate max-w-[300px] inline-block">
                      {invoice.file_name}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <InvoiceTypeTag type={invoice.invoice_type} />
              </TableCell>
              <TableCell title={invoice.created_at}>
                {format(new Date(invoice.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <InvoiceActions
                  invoice={invoice}
                  onView={onViewInvoice}
                  onDownload={onDownloadInvoice}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
