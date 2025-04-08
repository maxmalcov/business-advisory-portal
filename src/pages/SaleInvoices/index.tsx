
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SaleInvoiceList from './components/SaleInvoiceList';

const SaleInvoices: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
        <Link to="/sale-invoices/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('invoices.upload')}
          </Button>
        </Link>
      </div>
      
      <SaleInvoiceList />
    </div>
  );
};

export default SaleInvoices;
