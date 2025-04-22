
import React from 'react';
import { format } from 'date-fns';
import { formatFileSize } from '@/utils/fileUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { InvoiceItem } from '../../hooks/useInvoiceData';
import { Badge } from '@/components/ui/badge';

interface InvoiceTableProps {
  invoices: InvoiceItem[];
  loading: boolean;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, loading }) => {
  const handleView = (path: string) => {
    // Open in a new tab
    window.open(path, '_blank');
  };

  const handleDownload = (path: string, fileName: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = path;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-4 bg-muted w-48 mb-4 rounded"></div>
          <div className="h-4 bg-muted w-36 rounded"></div>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">No invoices found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{invoice.userName}</div>
                  <div className="text-sm text-muted-foreground">{invoice.userEmail}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{invoice.fileName}</TableCell>
              <TableCell>
                <Badge variant={invoice.type === 'sales' ? 'default' : 'secondary'}>
                  {invoice.type === 'sales' ? 'Sales' : 'Supplier'}
                </Badge>
              </TableCell>
              <TableCell>{format(invoice.date, 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell>{formatFileSize(invoice.size)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleView(invoice.path)}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDownload(invoice.path, invoice.fileName)}
                    title="Download"
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

export default InvoiceTable;
