
import React from 'react';
import { format } from 'date-fns';
import { FileUp, FileDown, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { InvoiceUpload } from './InvoiceHistoryList';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

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

  // Function to truncate filenames longer than 50 characters
  const truncateFileName = (fileName: string): string => {
    return fileName.length > 50 ? `${fileName.substring(0, 47)}...` : fileName;
  };
  
  // Function to check if text needs truncation
  const needsTruncation = (text: string): boolean => {
    return text.length > 50;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Sent To</TableHead>
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.invoice_type === 'sale' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                }`}>
                  {invoice.invoice_type === 'sale' ? 'Sales' : 'Supplier'}
                </span>
              </TableCell>
              <TableCell title={invoice.created_at}>
                {format(new Date(invoice.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {needsTruncation(invoice.sent_to_email || 'Not sent') ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate max-w-[150px] inline-block">
                          {invoice.sent_to_email || 'Not sent'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {invoice.sent_to_email || 'Not sent'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="truncate max-w-[150px] inline-block">
                    {invoice.sent_to_email || 'Not sent'}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceHistoryTable;
