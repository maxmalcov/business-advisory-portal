
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceHistoryList } from '@/pages/Invoices/components';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceHistoryTabs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-3">
        <TabsTrigger value="all">All Invoices</TabsTrigger>
        <TabsTrigger value="sale">Sale Invoices</TabsTrigger>
        <TabsTrigger value="supplier">Supplier Invoices</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <InvoiceHistoryList defaultType="all" />
      </TabsContent>
      
      <TabsContent value="sale">
        <InvoiceHistoryList defaultType="sale" />
      </TabsContent>
      
      <TabsContent value="supplier">
        <InvoiceHistoryList defaultType="supplier" />
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceHistoryTabs;
