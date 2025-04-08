
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const SupplierInvoicesHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{t('nav.supplier_invoices')}</h1>
    </div>
  );
};

export default SupplierInvoicesHeader;
