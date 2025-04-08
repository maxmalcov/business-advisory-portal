
import React from 'react';
import SupplierInvoicesHeader from './components/SupplierInvoicesHeader';
import SupplierInvoiceTabs from './components/SupplierInvoiceTabs';

const SupplierInvoices: React.FC = () => {
  return (
    <div className="space-y-6">
      <SupplierInvoicesHeader />
      <SupplierInvoiceTabs />
    </div>
  );
};

export default SupplierInvoices;
