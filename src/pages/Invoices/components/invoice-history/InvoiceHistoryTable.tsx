
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { InvoiceHistoryTableProps } from './types';
import { LoadingState } from './LoadingState';
import { InvoiceHistoryMobile } from './InvoiceHistoryMobile';
import { InvoiceHistoryDesktop } from './InvoiceHistoryDesktop';

const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
  isLoading,
  invoices,
  onViewInvoice,
  onDownloadInvoice
}) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return <LoadingState />;
  }

  return isMobile ? (
    <InvoiceHistoryMobile
      isLoading={isLoading}
      invoices={invoices}
      onViewInvoice={onViewInvoice}
      onDownloadInvoice={onDownloadInvoice}
    />
  ) : (
    <InvoiceHistoryDesktop
      isLoading={isLoading}
      invoices={invoices}
      onViewInvoice={onViewInvoice}
      onDownloadInvoice={onDownloadInvoice}
    />
  );
};

export default InvoiceHistoryTable;
