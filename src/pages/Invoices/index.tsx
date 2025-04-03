
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp } from 'lucide-react';
import InvoiceUpload from './components/InvoiceUpload';
import InvoiceList from './components/InvoiceList';
import { mockInvoices } from './mockData';

const Invoices: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
        <Link to="/invoices/create">
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            {t('invoices.upload')}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upload">{t('invoices.upload')}</TabsTrigger>
          <TabsTrigger value="history">{t('invoices.history')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <InvoiceUpload />
        </TabsContent>
        
        <TabsContent value="history">
          <InvoiceList invoices={mockInvoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoices;
