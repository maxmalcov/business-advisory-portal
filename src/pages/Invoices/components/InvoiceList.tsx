
import React, { useState } from 'react';
import { Search, FileUp, Check, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Invoice {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'pending' | 'rejected';
  size: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    invoice.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>
          View your previously uploaded invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Invoices list */}
        <div className="rounded-md border">
          <div className="bg-muted py-2 px-4 grid grid-cols-5 text-sm font-medium">
            <div className="col-span-2">File Name</div>
            <div>Date</div>
            <div>Size</div>
            <div>Status</div>
          </div>
          <div className="divide-y">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="grid grid-cols-5 py-3 px-4 items-center text-sm"
                >
                  <div className="col-span-2 flex items-center">
                    <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{invoice.fileName}</span>
                  </div>
                  <div>{invoice.uploadDate}</div>
                  <div>{invoice.size}</div>
                  <div className="flex items-center">
                    {getStatusIcon(invoice.status)}
                    <span className="ml-2 capitalize">{invoice.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No invoices found matching your search.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
