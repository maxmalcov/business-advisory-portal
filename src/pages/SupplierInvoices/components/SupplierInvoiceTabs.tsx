
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupplierInvoiceUpload from './SupplierInvoiceUpload';
import { InvoiceHistoryList } from '@/pages/Invoices/components';

interface SupplierInvoiceTabsProps {
  defaultTab?: string;
}

const SupplierInvoiceTabs: React.FC<SupplierInvoiceTabsProps> = ({ 
  defaultTab = "upload"
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-2">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <SupplierInvoiceUpload />
      </TabsContent>
      
      <TabsContent value="history">
        <InvoiceHistoryList defaultType="supplier" />
      </TabsContent>
    </Tabs>
  );
};

export default SupplierInvoiceTabs;
