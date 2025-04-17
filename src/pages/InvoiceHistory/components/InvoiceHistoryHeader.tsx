
import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceHistoryHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          {t('nav.invoice_history')}
        </h1>
      </div>
      <p className="text-muted-foreground">
        View and manage all your invoice uploads history
      </p>
    </div>
  );
};

export default InvoiceHistoryHeader;
