
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
import { useIsMobile } from '@/hooks/use-mobile';
import { truncateFileName, needsTruncation } from '@/utils/fileUtils';

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
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading invoice history...</p>
      </div>
    );
  }

  // Render mobile card view for invoices
  if (isMobile) {
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
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.invoice_type === 'sale' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                }`}>
                  {invoice.invoice_type === 'sale' ? 'Sales' : 'Supplier'}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2" title={invoice.created_at}>
                  {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="col-span-2">
                <span className="text-muted-foreground">Sent to:</span>
                <span className="ml-2 break-words">
                  {invoice.sent_to_email || 'Not sent'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewInvoice(invoice)}
                className="h-9"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDownloadInvoice(invoice)}
                className="h-9"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="w-[25%]">Sent To</TableHead>
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
                <span className="inline-block w-full overflow-visible break-words">
                  {invoice.sent_to_email || 'Not sent'}
                </span>
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
