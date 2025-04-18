
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceUpload from './InvoiceUpload';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceTabs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-1">
        <TabsTrigger value="upload">{t('invoices.upload')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <InvoiceUpload />
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceTabs;
