
import React from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const SupplierInvoicesHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{t('nav.supplier_invoices')}</h1>
      <Button>
        <FileDown className="mr-2 h-4 w-4" />
        Upload Supplier Invoice
      </Button>
    </div>
  );
};

export default SupplierInvoicesHeader;
