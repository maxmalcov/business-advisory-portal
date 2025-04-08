
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceUpload from './InvoiceUpload';
import InvoiceHistoryList from './InvoiceHistoryList';
import { useLanguage } from '@/context/LanguageContext';

interface InvoiceTabsProps {
  defaultTab?: string;
}

const InvoiceTabs: React.FC<InvoiceTabsProps> = ({ 
  defaultTab = "upload"
}) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-2">
        <TabsTrigger value="upload">{t('invoices.upload')}</TabsTrigger>
        <TabsTrigger value="history">{t('invoices.history')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <InvoiceUpload />
      </TabsContent>
      
      <TabsContent value="history">
        <InvoiceHistoryList defaultType="sale" />
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceTabs;
