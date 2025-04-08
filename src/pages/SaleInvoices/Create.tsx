
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SaleInvoiceUpload from './components/SaleInvoiceUpload';

const CreateSaleInvoice: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/sale-invoices">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('invoices.upload_title')}</h1>
      </div>
      
      <div className="max-w-2xl">
        <SaleInvoiceUpload />
      </div>
    </div>
  );
};

export default CreateSaleInvoice;
