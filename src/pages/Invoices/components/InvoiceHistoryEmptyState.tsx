
import React from 'react';

interface InvoiceHistoryEmptyStateProps {
  searchQuery: string;
  filterType: 'all' | 'sale' | 'supplier';
}

const InvoiceHistoryEmptyState: React.FC<InvoiceHistoryEmptyStateProps> = ({
  searchQuery,
  filterType
}) => {
  return (
    <div className="py-6 text-center text-muted-foreground">
      {searchQuery 
        ? 'No invoices found matching your search.'
        : filterType !== 'all'
          ? `No ${filterType} invoices found.`
          : 'No invoice history available.'}
    </div>
  );
};

export default InvoiceHistoryEmptyState;
