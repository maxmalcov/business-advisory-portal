import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useInvoiceData } from '../../hooks/useInvoiceData';
import InvoiceFilters from './InvoiceFilters';
import InvoiceTable from './InvoiceTable';
import InvoicePagination from './InvoicePagination';

const DocumentsTab: React.FC = () => {
  const {
    invoices,
    allInvoices,
    loading,
    filterOption,
    setFilterOption,
    customDateRange,
    setCustomDateRange,
    userFilter,
    setUserFilter,
    typeFilter,
    setTypeFilter,
    users,
    exportToCSV,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useInvoiceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
        <CardDescription>
          View and manage all invoices from your users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InvoiceFilters
          filterOption={filterOption}
          onFilterChange={setFilterOption}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
          userFilter={userFilter}
          onUserFilterChange={setUserFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          users={users}
          onExport={exportToCSV}
          totalItems={allInvoices.length}
        />

        <InvoiceTable invoices={invoices} loading={loading} />

        <InvoicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
