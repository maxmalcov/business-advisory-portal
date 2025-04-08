
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceUpload from './components/InvoiceUpload';
import InvoiceList from './components/InvoiceList';
import { mockInvoices } from './mockData';

const Invoices: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
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
