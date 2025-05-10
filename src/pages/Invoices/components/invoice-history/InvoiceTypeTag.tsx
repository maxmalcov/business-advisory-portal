import React from 'react';
import { InvoiceTypeTagProps } from './types';
import { useLanguage } from '@/context/LanguageContext.tsx';

export const InvoiceTypeTag: React.FC<InvoiceTypeTagProps> = ({ type }) => {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        type === 'sale'
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
          : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
      }`}
    >
      {type === 'sale'
        ? t('invoices.search.sales')
        : t('invoices.search.supplier')}
    </span>
  );
};
