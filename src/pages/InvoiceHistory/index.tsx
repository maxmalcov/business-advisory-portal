
import React from 'react';
import InvoiceHistoryList from '../Invoices/components/InvoiceHistoryList';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceHistory = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/invoices">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">{t('invoices.history')}</h1>
        </div>
      </div>
      <InvoiceHistoryList defaultType="all" />
    </div>
  );
};

export default InvoiceHistory;
