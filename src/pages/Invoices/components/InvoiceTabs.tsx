import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceUpload from './InvoiceUpload';
import { useLanguage } from '@/context/LanguageContext';

const InvoiceTabs: React.FC = () => {
  const { t } = useLanguage();

  return <InvoiceUpload />;
};

export default InvoiceTabs;
