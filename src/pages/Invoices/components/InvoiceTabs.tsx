
import React from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const activeTab = tabFromUrl || defaultTab;

  return (
    <Tabs defaultValue={activeTab} className="w-full">
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
