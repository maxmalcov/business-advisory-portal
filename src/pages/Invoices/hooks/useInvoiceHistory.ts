import { useFetchInvoices } from './useFetchInvoices';
import { useInvoiceFileOperations } from './useInvoiceFileOperations';
import { useInvoiceFilter } from './useInvoiceFilter';

type FilterType = 'all' | 'sale' | 'supplier';

export function useInvoiceHistory(defaultType: FilterType = 'all') {
  // Use our specialized hooks
  const { invoices, isLoading, refreshInvoices } = useFetchInvoices();
  const { handleViewInvoice, handleDownloadInvoice } =
    useInvoiceFileOperations();
  const {
    filteredInvoices,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
  } = useInvoiceFilter(invoices, defaultType);

  return {
    invoices: filteredInvoices,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    handleViewInvoice,
    handleDownloadInvoice,
    refreshInvoices,
  };
}
