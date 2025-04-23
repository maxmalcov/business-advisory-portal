
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
    window.open(path, '_blank');
  };

  const handleDownload = (path: string, fileName: string) => {
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
          <div className="h-4 bg-purple-200 w-48 mb-4 rounded"></div>
          <div className="h-4 bg-purple-200 w-36 rounded"></div>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-purple-600">No invoices found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-purple-200">
      <Table>
        <TableHeader className="bg-purple-50">
          <TableRow>
            <TableHead className="text-purple-800">User</TableHead>
            <TableHead className="text-purple-800">File Name</TableHead>
            <TableHead className="text-purple-800">Type</TableHead>
            <TableHead className="text-purple-800">Upload Date</TableHead>
            <TableHead className="text-purple-800 text-right">Size</TableHead>
            <TableHead className="text-purple-800 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-purple-50/50">
              <TableCell>
                <div>
                  <div className="font-medium text-purple-800">{invoice.userName}</div>
                  <div className="text-sm text-purple-600">{invoice.userEmail}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-purple-700">{invoice.fileName}</TableCell>
              <TableCell>
                <Badge 
                  variant="default" 
                  className={`
                    ${invoice.type === 'sales' 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}
                  `}
                >
                  {invoice.type === 'sales' ? 'Sales' : 'Supplier'}
                </Badge>
              </TableCell>
              <TableCell className="text-purple-700">{format(invoice.date, 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell className="text-right text-purple-700">{formatFileSize(invoice.size)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleView(invoice.path)}
                    className="text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDownload(invoice.path, invoice.fileName)}
                    className="text-purple-600 hover:bg-purple-100 hover:text-purple-800"
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

