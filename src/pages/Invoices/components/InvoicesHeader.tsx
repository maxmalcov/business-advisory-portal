
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText } from 'lucide-react';

const InvoicesHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-4 pb-4 border-b">
      <div className="bg-primary/10 p-3 rounded-full">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('invoices.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('language') === 'es' ? 'Suba y gestione sus facturas de venta' : 'Upload and manage your sales invoices'}
        </p>
      </div>
    </div>
  );
};

export default InvoicesHeader;
