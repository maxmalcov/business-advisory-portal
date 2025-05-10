import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInvoiceHistory } from '../hooks/useInvoiceHistory';
import InvoiceHistoryFilter from './InvoiceHistoryFilter';
import InvoiceHistoryTable from './invoice-history/InvoiceHistoryTable';
import InvoiceHistoryEmptyState from './InvoiceHistoryEmptyState';

export interface InvoiceUpload {
  id: string;
  file_name: string;
  invoice_type: 'sale' | 'supplier';
  created_at: string;
  sent_to_email: string | null;
  sent_at: string | null;
  file_path: string;
  storage_path: string;
}

interface InvoiceHistoryListProps {
  defaultType?: 'all' | 'sale' | 'supplier';
}

const InvoiceHistoryList: React.FC<InvoiceHistoryListProps> = ({
  defaultType = 'all',
}) => {
  const { user } = useAuth();
  const {
    invoices,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    handleViewInvoice,
    handleDownloadInvoice,
  } = useInvoiceHistory(defaultType);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <InvoiceHistoryFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {invoices.length > 0 ? (
        <InvoiceHistoryTable
          isLoading={isLoading}
          invoices={invoices}
          onViewInvoice={handleViewInvoice}
          onDownloadInvoice={handleDownloadInvoice}
        />
      ) : (
        <InvoiceHistoryEmptyState
          searchQuery={searchQuery}
          filterType={filterType}
        />
      )}
    </div>
  );
};

export default InvoiceHistoryList;
