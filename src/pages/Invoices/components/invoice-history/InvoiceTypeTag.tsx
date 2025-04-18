
import React from 'react';
import { InvoiceTypeTagProps } from './types';

export const InvoiceTypeTag: React.FC<InvoiceTypeTagProps> = ({ type }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      type === 'sale' 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
    }`}>
      {type === 'sale' ? 'Sales' : 'Supplier'}
    </span>
  );
};
