
import React from 'react';
import InvoiceHistoryList from '../Invoices/components/InvoiceHistoryList';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceHistory = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('invoices.history')}</h1>
      </div>
      <InvoiceHistoryList defaultType="all" />
    </div>
  );
};

export default InvoiceHistory;

