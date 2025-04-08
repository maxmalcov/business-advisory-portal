
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupplierInvoiceUpload from './components/SupplierInvoiceUpload';
import SupplierInvoiceList from './components/SupplierInvoiceList';
import { mockSupplierInvoices } from './mockData';

const SupplierInvoices: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('nav.supplier_invoices')}</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Upload Supplier Invoice
        </Button>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <SupplierInvoiceUpload />
        </TabsContent>
        
        <TabsContent value="history">
          <SupplierInvoiceList invoices={mockSupplierInvoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierInvoices;
