
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const InvoicesHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
    </div>
  );
};

export default InvoicesHeader;
