
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useFetchInvoices } from './useFetchInvoices';
import { useInvoiceFilters } from './useInvoiceFilters';
import { DateFilterOption } from '@/pages/AdminUserManagement/hooks/types';
import { useDateFilter } from '@/pages/AdminUserManagement/hooks/useDateFilter';
import type { InvoiceItem } from './types/invoiceTypes';

export type { InvoiceItem };

export const useInvoiceData = () => {
  const [userFilter, setUserFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sales' | 'supplier'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const {
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange
  } = useDateFilter('30days');

  const { invoices, users, loading, fetchInvoices } = useFetchInvoices();
  
  const filteredInvoices = useInvoiceFilters(
    invoices,
    userFilter,
    typeFilter,
    currentDateRange
  );
  
  // Calculate pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredInvoices.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredInvoices.length]);
  
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);
  
  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = ['User', 'Email', 'File Name', 'Type', 'Upload Date', 'File Size'];
    const rows = [headers];
    
    filteredInvoices.forEach(invoice => {
      rows.push([
        invoice.userName,
        invoice.userEmail,
        invoice.fileName,
        invoice.type,
        format(invoice.date, 'yyyy-MM-dd HH:mm:ss'),
        `${Math.round(invoice.size / 1024)} KB`
      ]);
    });
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const date = format(new Date(), 'yyyy-MM-dd');
    
    link.href = URL.createObjectURL(blob);
    link.download = `invoices-report-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices: paginatedInvoices,
    allInvoices: filteredInvoices,
    loading,
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    currentDateRange,
    userFilter,
    setUserFilter,
    typeFilter,
    setTypeFilter,
    users,
    exportToCSV,
    currentPage,
    totalPages,
    setCurrentPage
  };
};
