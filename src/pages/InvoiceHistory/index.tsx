
import React from 'react';
import InvoiceHistoryList from '../Invoices/components/InvoiceHistoryList';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceHistory = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your invoice records
          </p>
        </div>
      </div>
      <InvoiceHistoryList defaultType="all" />
    </div>
  );
};

export default InvoiceHistory;
