
import React from 'react';
import { FileX } from 'lucide-react';

interface InvoiceHistoryEmptyStateProps {
  searchQuery: string;
  filterType: 'all' | 'sale' | 'supplier';
}

const InvoiceHistoryEmptyState: React.FC<InvoiceHistoryEmptyStateProps> = ({
  searchQuery,
  filterType
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Invoices Found</h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery 
          ? 'No invoices found matching your search criteria.'
          : filterType !== 'all'
            ? `No ${filterType} invoices found.`
            : 'No invoice history available yet.'}
      </p>
    </div>
  );
};

export default InvoiceHistoryEmptyState;
