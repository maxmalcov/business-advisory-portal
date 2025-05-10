import { useState, useEffect } from 'react';
import { InvoiceUpload } from '../components/InvoiceHistoryList';

type FilterType = 'all' | 'sale' | 'supplier';

export function useInvoiceFilter(
  invoices: InvoiceUpload[],
  initialFilterType: FilterType = 'all',
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(initialFilterType);
  const [filteredInvoices, setFilteredInvoices] =
    useState<InvoiceUpload[]>(invoices);

  useEffect(() => {
    // Filter invoices based on search query and type filter
    let filtered = [...invoices];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(
        (invoice) => invoice.invoice_type === filterType,
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.file_name.toLowerCase().includes(query) ||
          (invoice.sent_to_email &&
            invoice.sent_to_email.toLowerCase().includes(query)),
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchQuery, filterType]);

  return {
    filteredInvoices,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
  };
}
