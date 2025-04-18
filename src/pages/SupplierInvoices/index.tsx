
import React from 'react';
import SupplierInvoicesHeader from './components/SupplierInvoicesHeader';
import SupplierInvoiceTabs from './components/SupplierInvoiceTabs';

const SupplierInvoices: React.FC = () => {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      <SupplierInvoicesHeader />
      <SupplierInvoiceTabs />
    </div>
  );
};

export default SupplierInvoices;
