
import { useMemo } from 'react';
import { InvoiceItem } from './types/invoiceTypes';
import { isWithinDateRange } from '@/utils/dates';

export const useInvoiceFilters = (
  invoices: InvoiceItem[],
  userFilter: string,
  typeFilter: 'all' | 'sales' | 'supplier',
  dateRange: { from?: Date; to?: Date }
) => {
  return useMemo(() => {
    return invoices.filter(invoice => {
      // Apply date filter
      const dateInRange = !dateRange.from || !dateRange.to || 
        isWithinDateRange(invoice.date, dateRange.from, dateRange.to);
      
      // Apply user filter
      const userMatch = !userFilter || 
        invoice.userId === userFilter || 
        invoice.userName.toLowerCase().includes(userFilter.toLowerCase()) || 
        invoice.userEmail.toLowerCase().includes(userFilter.toLowerCase());
      
      // Apply type filter
      const typeMatch = typeFilter === 'all' || invoice.type === typeFilter;
      
      return dateInRange && userMatch && typeMatch;
    });
  }, [invoices, userFilter, typeFilter, dateRange]);
};
